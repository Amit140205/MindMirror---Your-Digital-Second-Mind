const QUEUE_KEY = "sessionQueue";
const BATCH_INTERVAL_MINUTES = 2;
const MIN_TRACK_TIME = 3000;

// System-level patterns never tracked (privacy, browser internals) 
const IGNORED_PATTERNS = [
  "chrome://",
  "chrome-extension://",
  "about:",
  "edge://",
  "brave://",
];

// Default privacy-sensitive domains blocked for all users
const DEFAULT_PRIVACY_BLOCKS = [
  // Payments & banking
  "paypal.com",
  "stripe.com",
  "razorpay.com",
  "paytm.com",
  "phonepe.com",
  "gpay.com",
  "netbanking",
  "ibanking",
  "onlinebanking",
  "hdfcbank.com",
  "icicibank.com",
  "sbi.co.in",
  "axisbank.com",
  "kotak.com",
  "yesbank.in",
  "rbi.org.in",
  "bankofamerica.com",
  "chase.com",
  "wellsfargo.com",
  "citibank.com",
  // Credit cards & finance
  "americanexpress.com",
  "visa.com",
  "mastercard.com",
  "discover.com",
  "creditmantri.com",
  "cibil.com",
  // Password managers
  "1password.com",
  "lastpass.com",
  "bitwarden.com",
  "dashlane.com",
  "keeper.io",
  "nordpass.com",
  // Google Workspace (docs, sheets, drive, forms, gmail etc.)
  "docs.google.com",
  "sheets.google.com",
  "drive.google.com",
  "forms.google.com",
  "mail.google.com",
  // Medical & health
  "practo.com",
  "1mg.com",
  "medlineplus.gov",
  "mayoclinic.org",
  "webmd.com",
  // Tax & government portals
  "incometax.gov.in",
  "efiling.incometaxindiaefiling.gov.in",
  "irs.gov",
  "gov.in",
  // Authentication & SSO pages (common paths)
  "accounts.google.com",
  "login.microsoftonline.com",
  "auth0.com",
  "okta.com",
];

export async function shouldTrack(url) {
  if (!url) return false;

  // Block browser-internal schemes
  if (IGNORED_PATTERNS.some((pattern) => url.startsWith(pattern))) return false;
  if (url === chrome.runtime.getURL("newtab.html")) return false;

  // Block default privacy-sensitive domains
  if (DEFAULT_PRIVACY_BLOCKS.some((domain) => url.includes(domain)))
    return false;

  // Block user-defined ignored patterns (from settings)
  const result = await chrome.storage.local.get("ignoredPatterns");
  const userPatterns = result.ignoredPatterns || [];
  if (userPatterns.some((pattern) => url.includes(pattern))) return false;

  return true;
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

// Session Queue 

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
      extractedText:
        current.extractedText ||
        JSON.stringify({ initial: "", updates: [] }),
    });
  } finally {
    isEndingSession = false;
  }
}

export async function queueSession(session) {
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