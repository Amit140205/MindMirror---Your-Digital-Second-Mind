const QUEUE_KEY = "sessionQueue";
const BATCH_INTERVAL_MINUTES = 2;
const MIN_TRACK_TIME = 3000;

const IGNORED_PATTERNS = [
  "chrome://",
  "chrome-extension://",
  "about:",
  "edge://",
  "brave://",
];

export async function shouldTrack(url) {
    if (!url) return false
    if (IGNORED_PATTERNS.some(pattern => url.startsWith(pattern))) return false
    if (url === chrome.runtime.getURL("newtab.html")) return false

    const result = await chrome.storage.local.get("ignoredPatterns")
    const userPatterns = result.ignoredPatterns || []
    if (userPatterns.some(pattern => url.includes(pattern))) return false

    return true
}

export function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function getISOTime() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((p) => [p.type, p.value]),
  );

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
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
  const current = await getCurrentSession();
  const extractedText =
    current && current.url === url ? current.extractedText : "";
  await setCurrentSession({
    tabId,
    url,
    title,
    domain: extractDomain(url),
    startTime: Date.now(),
    openedAt: getISOTime(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // CHANGED: structured format instead of old "[]"
    extractedText: extractedText || JSON.stringify({ initial: "", updates: [] }),
  });
}

let isEndingSession = false;

export async function endCurrentSession() {
  if (isEndingSession) return;
  isEndingSession = true;

  try {
    const current = await getCurrentSession();
    if (!current) return;

    await setCurrentSession(null);

    const timeSpent = Date.now() - current.startTime;

    await queueSession({
      url: current.url,
      title: current.title,
      domain: current.domain,
      timeSpent: timeSpent,
      openedAt: current.openedAt,
      closedAt: getISOTime(),
      timeZone: current.timeZone,
      // CHANGED: structured format fallback instead of old "[]"
      extractedText: current.extractedText || JSON.stringify({ initial: "", updates: [] }),
    });
  } finally {
    isEndingSession = false;
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

  const tokenResult = await chrome.storage.local.get("token");
  const token = tokenResult.token;

  if (!token) {
    console.log("MindMirror: no token, skipping flush");
    return;
  }

  console.log(`MindMirror: batch flush → ${queue.length} sessions`);
  console.log("MindMirror: sessions data →", JSON.stringify(queue, null, 2));

  try {
    const BACKEND_URL = "http://localhost:3000";
    const response = await fetch(`${BACKEND_URL}/api/user/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sessions: queue }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(`MindMirror: ${data.message}`);
      await chrome.storage.local.set({ [QUEUE_KEY]: [] });
    } else {
      console.log("MindMirror: flush failed, queue preserved");
    }
  } catch {
    console.log("MindMirror: flush failed, queue preserved");
  }
}

export function setupBatchAlarm() {
  chrome.alarms.create("batchFlush", {
    periodInMinutes: BATCH_INTERVAL_MINUTES,
  });
}