import {
  shouldTrack,
  extractDomain,
  getCurrentSession,
  setCurrentSession,
  startNewSession,
  endCurrentSession,
  setupBatchAlarm,
  batchFlush,
} from "./sessionManager.js";

// AUTH CHECK
async function isAuthenticated() {
  const result = await chrome.storage.local.get("token");
  return !!result.token;
}

const lastContentMap = new Map();

// JACCARD SIMILARITY (a statistical metric used to measure the overlap between two sets)
// Returns 0.0 (completely different) to 1.0 (identical).
function jaccardSimilarity(a, b) {
  if (!a || !b) return 0;

  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));

  if (wordsA.size === 0 && wordsB.size === 0) return 1;
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }

  const union = wordsA.size + wordsB.size - intersection;
  return intersection / union;
}

// EVENT LISTENERS

// 1. Tab switched
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!(await isAuthenticated())) return;

  const previous = await getCurrentSession();
  if (previous) {
    lastContentMap.delete(previous.tabId);
    await endCurrentSession();
  }

  try {
    const tab = await chrome.tabs.get(tabId);
    if (await shouldTrack(tab.url)) {
      await startNewSession(tabId, tab.url, tab.title);
      console.log(`MindMirror: tracking started ${tab.url}`);
    }
  } catch {
    await setCurrentSession(null);
  }
});

// 2. URL changed within same tab
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!(await isAuthenticated())) return;
  if (changeInfo.status !== "complete") return;
  if (!(await shouldTrack(tab.url))) return

  const current = await getCurrentSession();

  if (current && current.tabId === tabId) {
    const timeAlive = Date.now() - current.startTime;
    if (timeAlive < 3000) return;

    lastContentMap.delete(tabId);
    await endCurrentSession();
    await startNewSession(tabId, tab.url, tab.title);
    console.log(`MindMirror: URL changed ${tab.url}`);
  } else {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (activeTab && activeTab.id === tabId) {
      await startNewSession(tabId, tab.url, tab.title);
      console.log(`MindMirror: new session started ${tab.url}`);
    }
  }
});

// 3. Tab closed
chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (!(await isAuthenticated())) return;

  const current = await getCurrentSession();
  if (current && current.tabId === tabId) {
    lastContentMap.delete(tabId);
    await endCurrentSession();
    console.log(`MindMirror: tab closed => session ended`);
  }
});

// 4. Window focus changed
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (!(await isAuthenticated())) return;

  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    const current = await getCurrentSession();
    if (!current) return; // no active session — skip spam
    lastContentMap.delete(current.tabId);
    await endCurrentSession();
    console.log("MindMirror: browser lost focus => session ended");
  } else {
    try {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (activeTab && await shouldTrack(activeTab.url)) {
        await startNewSession(activeTab.id, activeTab.url, activeTab.title);
        console.log(`MindMirror: browser regained focus => ${activeTab.url}`);
      }
    } catch {
      await setCurrentSession(null);
    }
  }
});

// 5. Service worker suspending
chrome.runtime.onSuspend.addListener(async () => {
  const current = await getCurrentSession();
  if (current) {
    lastContentMap.delete(current.tabId);
    await endCurrentSession();
  }
  await batchFlush();
});

// ALARM
setupBatchAlarm();

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (!(await isAuthenticated())) return;
  if (alarm.name === "batchFlush") await batchFlush();
});

// EXTRACTED_CONTENT handler 
// Single push path. content.js fires and forgets — no pull, no race.
// All dedup logic lives here.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "EXTRACTED_CONTENT") return;

  const { url, contentType, content } = message.payload;

  (async () => {
    try {
      const current = await getCurrentSession();

      // guard 1: must have an active session
      if (!current) {
        sendResponse({ status: "no_session" });
        return;
      }

      // guard 2: domain must match current session
      // prevents content from a navigated-away tab polluting the new session
      if (extractDomain(current.url) !== extractDomain(url)) {
        console.log(`MindMirror: domain mismatch — ignoring content for ${url}`);
        sendResponse({ status: "domain_mismatch" });
        return;
      }

      const newBody = content.body || "";

      // guard 3: discard empty body — empty string scores 0 on Jaccard (always
      // passes the < 0.8 check) so it must be caught before any diff logic.
      // Happens when content script fires before JS has rendered the DOM.
      if (!newBody && content.headings.length === 0) {
        console.log(`MindMirror: empty content discarded for ${url}`);
        sendResponse({ status: "empty_discarded" });
        return;
      }

      // parse existing extractedText or start fresh
      let extracted;
      try {
        extracted = JSON.parse(current.extractedText);
        // handle legacy format (old array "[]" or old object without our keys)
        if (!extracted || typeof extracted !== "object" || Array.isArray(extracted)) {
          extracted = { initial: "", updates: [] };
        }
      } catch {
        extracted = { initial: "", updates: [] };
      }

      if (contentType === "initial") {
        // initial scrape — always overwrite initial field, no diff check needed
        extracted.initial = newBody;
        lastContentMap.set(current.tabId, newBody);
        console.log(`MindMirror: initial content saved for ${url}`);
      } else {
        // update — guard 3: diff check against last saved body
        // discard if >= 80% similar (redundant scrape)
        const lastBody = lastContentMap.get(current.tabId) ?? null;

        if (lastBody !== null) {
          const similarity = jaccardSimilarity(newBody, lastBody);
          if (similarity >= 0.8) {
            console.log(`MindMirror: update ${Math.round(similarity * 100)}% similar — discarded`);
            sendResponse({ status: "discarded_similar" });
            return;
          }
        }

        // meaningfully different — append to updates array
        // skip empty updates (safety net — should be caught above but belt+braces)
        if (!newBody) {
          sendResponse({ status: "empty_discarded" });
          return;
        }
        extracted.updates.push(newBody);
        lastContentMap.set(current.tabId, newBody);
        console.log(`MindMirror: update content appended for ${url}`);
      }

      await setCurrentSession({
        ...current,
        extractedText: JSON.stringify(extracted),
      });

      sendResponse({ status: "saved" });

    } catch (err) {
      console.log("MindMirror: error handling content", err);
      sendResponse({ status: "error" });
    }
  })();

  return true; // keep channel open for async response
});

console.log("MindMirror: background service worker running");