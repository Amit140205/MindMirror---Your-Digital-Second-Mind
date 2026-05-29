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

// JACCARD SIMILARITY

const lastContentMap = new Map();

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

// NOTIFICATIONS

// Show a desktop notification (requires "notifications" permission in manifest).
function showNotification(id, title, message) {
  chrome.notifications.create(id, {
    type: "basic",
    iconUrl: "/icons/icon.png",
    title,
    message,
    priority: 1,
  });
}

// Show the one-time "tracking started" notification after login.
// Guards against showing it more than once per install via storage flag.
let notifLock = false;
async function maybeShowLoginNotification() {
  if (notifLock) return;
  notifLock = true;

  const result = await chrome.storage.local.get("hasShownLoginNotif");
  if (result.hasShownLoginNotif) return;

  showNotification(
    "mindmirror-login",
    "MindMirror is active 🪞✦",
    "Your digital memory is now running.\n" +
      'Ask anything — "What did I read today?"\n' +
      "Payments, passwords & sensitive sites are never tracked.",
  );

  await chrome.storage.local.set({ hasShownLoginNotif: true });
  console.log("MindMirror: login notification shown");
}

// BREAK TIMER
const BREAK_ALARM = "breakReminder";
const BREAK_MINUTES = 60; // notify after this many continuous minutes
const CHECK_INTERVAL = 1; // alarm fires every 1 minute to check elapsed time

async function startBreakTimer() {
  const now = Date.now();
  await chrome.storage.session.set({ breakActiveFrom: now });
  console.log("MindMirror: break timer started");
}

async function resetBreakTimer() {
  await chrome.storage.session.remove("breakActiveFrom");
  console.log("MindMirror: break timer reset");
}

async function checkBreakTimer() {
  const result = await chrome.storage.session.get("breakActiveFrom");
  if (!result.breakActiveFrom) return;

  const elapsedMs = Date.now() - result.breakActiveFrom;
  const elapsedMinutes = elapsedMs / 60000;

  if (elapsedMinutes >= BREAK_MINUTES) {
    showNotification(
      "mindmirror-break",
      "Time to take a break 🌿",
      "You've been browsing for over an hour. " +
        "Step away, stretch, rest your eyes. " +
        "MindMirror will keep running when you return.",
    );
    // Reset so the next notification fires 1 hour from now
    await resetBreakTimer();
    console.log("MindMirror: break notification sent — timer reset");
  }
}

function setupBreakAlarm() {
  chrome.alarms.create(BREAK_ALARM, {
    periodInMinutes: CHECK_INTERVAL,
  });
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
  if (!(await shouldTrack(tab.url))) return;

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
    // Browser lost focus → pause break timer and end session
    await resetBreakTimer();

    const current = await getCurrentSession();
    if (!current) return;
    lastContentMap.delete(current.tabId);
    await endCurrentSession();
    console.log(
      "MindMirror: browser lost focus => session ended, break timer reset",
    );
  } else {
    // Browser regained focus → resume break timer
    await startBreakTimer();

    try {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (activeTab && (await shouldTrack(activeTab.url))) {
        await startNewSession(activeTab.id, activeTab.url, activeTab.title);
        console.log(`MindMirror: browser regained focus => ${activeTab.url}`);
      }
    } catch {
      await setCurrentSession(null);
    }
  }
});

// 5. Service worker suspending (browser closing / going idle)
chrome.runtime.onSuspend.addListener(async () => {
  const current = await getCurrentSession();
  if (current) {
    lastContentMap.delete(current.tabId);
    await endCurrentSession();
  }
  await resetBreakTimer();
  await batchFlush();
});

// ALARMS

setupBatchAlarm();
setupBreakAlarm();

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (!(await isAuthenticated())) return;

  if (alarm.name === "batchFlush") {
    await batchFlush();
  }

  if (alarm.name === BREAK_ALARM) {
    await checkBreakTimer();
  }
});

// MESSAGES

// Handle EXTRACTED_CONTENT from content.js (fire-and-forget push)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "USER_LOGGED_IN") {
    (async () => {
      await maybeShowLoginNotification();
      await startBreakTimer();
    })();
    return;
  }

  if (message.type !== "EXTRACTED_CONTENT") return;

  const { url, contentType, content } = message.payload;

  (async () => {
    try {
      const current = await getCurrentSession();

      if (!current) {
        sendResponse({ status: "no_session" });
        return;
      }

      if (extractDomain(current.url) !== extractDomain(url)) {
        console.log(
          `MindMirror: domain mismatch — ignoring content for ${url}`,
        );
        sendResponse({ status: "domain_mismatch" });
        return;
      }

      const newBody = content.body || "";

      if (!newBody && content.headings.length === 0) {
        console.log(`MindMirror: empty content discarded for ${url}`);
        sendResponse({ status: "empty_discarded" });
        return;
      }

      let extracted;
      try {
        extracted = JSON.parse(current.extractedText);
        if (
          !extracted ||
          typeof extracted !== "object" ||
          Array.isArray(extracted)
        ) {
          extracted = { initial: "", updates: [] };
        }
      } catch {
        extracted = { initial: "", updates: [] };
      }

      if (contentType === "initial") {
        extracted.initial = newBody;
        lastContentMap.set(current.tabId, newBody);
        console.log(`MindMirror: initial content saved for ${url}`);
      } else {
        const lastBody = lastContentMap.get(current.tabId) ?? null;

        if (lastBody !== null) {
          const similarity = jaccardSimilarity(newBody, lastBody);
          if (similarity >= 0.8) {
            console.log(
              `MindMirror: update ${Math.round(similarity * 100)}% similar — discarded`,
            );
            sendResponse({ status: "discarded_similar" });
            return;
          }
        }

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

  return true;
});

// STARTUP
(async () => {
  if (await isAuthenticated()) {
    await maybeShowLoginNotification();
  }
})();

console.log("MindMirror: background service worker running");
