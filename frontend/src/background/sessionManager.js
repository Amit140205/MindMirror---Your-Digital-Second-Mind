const QUEUE_KEY = "sessionQueue";
const BATCH_INTERVAL_MINUTES = 2;
const MIN_TRACK_TIME = 3000;

const IGNORED_PATTERNS = [
  "chrome://",
  "chrome-extension://",
  "about:",
  "edge://",
  "brave://",
]

export function shouldTrack(url) {
  if (!url) return false
  if (IGNORED_PATTERNS.some((pattern) => url.startsWith(pattern))) return false
  // never track the MindMirror chat tab itself
  if (url === chrome.runtime.getURL("newtab.html")) return false
  return true
}

export function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function getLocalTime() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Date().toLocaleString("en-IN", { timeZone: timezone });
}

// Current Session (chrome.storage.session)

export async function getCurrentSession() {
  const result = await chrome.storage.session.get("currentSession");
  return result.currentSession || null;
}

export async function setCurrentSession(session) {
  if (session) {
    await chrome.storage.session.set({ currentSession: session });
  } else {
    await chrome.storage.session.remove("currentSession");
  }
}

// Session Queue (based on tab activity)

export async function startNewSession(tabId, url, title) {
  const current = await getCurrentSession()
  const extractedText = (current && current.url === url) 
    ? current.extractedText 
    : ""
  await setCurrentSession({
    tabId,
    url,
    title,
    domain: extractDomain(url),
    startTime: Date.now(),
    openedAt: getLocalTime(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    extractedText: extractedText,
  });
}

let isEndingSession = false

export async function endCurrentSession() {
  if (isEndingSession) return
  isEndingSession = true

  try {
    const current = await getCurrentSession()
    if (!current) return

    await setCurrentSession(null)

    const timeSpent = Date.now() - current.startTime

    await queueSession({
      url:           current.url,
      title:         current.title,
      domain:        current.domain,
      timeSpent:     timeSpent,
      openedAt:      current.openedAt,
      closedAt:      getLocalTime(),
      timezone:      current.timezone,
      extractedText: current.extractedText || ""
    })
  } finally {
    isEndingSession = false
  }
}

export async function queueSession(session) {
  // ignore very short visits
  if (session.timeSpent < MIN_TRACK_TIME) {
    console.log("MindMirror: session too short, ignored", session.url);
    return;
  }

  const result = await chrome.storage.local.get(QUEUE_KEY);
  const queue = result[QUEUE_KEY] || [];

  queue.push(session);

  await chrome.storage.local.set({ [QUEUE_KEY]: queue });

  console.log(
    `MindMirror: session queued => ${session.url} | ${Math.round(session.timeSpent / 1000)}s | queue size: ${queue.length}`,
  );
}

// Batch Flush

export async function batchFlush() {
  const result = await chrome.storage.local.get(QUEUE_KEY);
  const queue = result[QUEUE_KEY] || [];

  if (queue.length === 0) return;

  const tokenResult = await chrome.storage.local.get("token")
  const token = tokenResult.token

  if (!token) {
    console.log("MindMirror: no token, skipping flush")
    return
  }

  console.log(`MindMirror: batch flush → ${queue.length} sessions`);
  console.log("MindMirror: sessions data →", JSON.stringify(queue, null, 2));

  try {
    // not ideal but have to do it because service worker context issue, does not load from .env
    const BACKEND_URL = "http://localhost:3000"

    const response = await fetch(`${BACKEND_URL}/api/user/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ sessions: queue })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`MindMirror: ${data.message}`)
      await chrome.storage.local.set({ [QUEUE_KEY]: [] })
    } else {
      console.log("MindMirror: flush failed, queue preserved")
    }
  } catch {
    // keep queue intact on failure
    // will retry next browser open
    console.log("MindMirror: flush failed, queue preserved");
  }
}

export function setupBatchAlarm() {
  chrome.alarms.create("batchFlush", {
    periodInMinutes: BATCH_INTERVAL_MINUTES,
  });
}
