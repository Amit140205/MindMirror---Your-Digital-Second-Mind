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

// Auth Check

async function isAuthenticated() {
  const result = await chrome.storage.local.get("token");
  return !!result.token;
}

// Event Listeners

// 1. Tab switched
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!(await isAuthenticated())) return;

  await endCurrentSession();

  try {
    const tab = await chrome.tabs.get(tabId);
    if (shouldTrack(tab.url)) {
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
  if (!shouldTrack(tab.url)) return;

  const current = await getCurrentSession();

  if (current && current.tabId === tabId) {
    // only end if session has been running for more than 3 seconds
    // prevents killing a just-started session from onActivated
    const timeAlive = Date.now() - current.startTime;
    if (timeAlive < 3000) return;

    await endCurrentSession();
    await startNewSession(tabId, tab.url, tab.title);
    console.log(`MindMirror: URL changed ${tab.url}`);
  } else {
    // no current session for this tab
    // check if this is the active tab
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
    await endCurrentSession();
    console.log(`MindMirror: tab closed => session ended`);
  }
});

// 4. Window focus changed
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (!(await isAuthenticated())) return;

  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // browser lost focus
    await endCurrentSession();
    console.log("MindMirror: browser lost focus => session ended");
  } else {
    // browser regained focus
    try {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (activeTab && shouldTrack(activeTab.url)) {
        await startNewSession(activeTab.id, activeTab.url, activeTab.title);
        console.log(`MindMirror: browser regained focus => ${activeTab.url}`);
      }
    } catch {
      await setCurrentSession(null);
    }
  }
});

// 5. Service worker suspending (when chrome is closed)
chrome.runtime.onSuspend.addListener(async () => {
  await endCurrentSession();
  await batchFlush();
});

// Alarm

setupBatchAlarm();

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (!(await isAuthenticated())) return;

  if (alarm.name === "batchFlush") {
    await batchFlush();
  }
});

// content extraction
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "EXTRACTED_CONTENT") return;

  const { url, content } = message.payload;

  // handle async inside listener
  (async () => {
    try {
      const current = await getCurrentSession();

      // only update if extracted URL matches current session URL
      if (current && extractDomain(current.url) === extractDomain(url)) {
        await setCurrentSession({
          ...current,
          extractedText: JSON.stringify(content),
        });
        console.log(`MindMirror: extracted content saved for ${url}`);
        sendResponse({ success: true });
      } else {
        console.log(`MindMirror: URL mismatch, extraction ignored`);
        sendResponse({ success: false, reason: "url mismatch" });
      }
    } catch (error) {
      console.log("MindMirror: error saving extracted content", error);
      sendResponse({ success: false });
    }
  })();

  // return true to keep message channel open for async response
  return true;
});

console.log("MindMirror: background service worker running");
