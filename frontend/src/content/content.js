// CONFIG
const SCROLL_WAIT_MS = 5000;
const LONG_SESSION_MS = 5 * 60 * 1000;
const MIN_BODY_LENGTH = 100; // raised: broad selectors include div/span noise
const MAX_BODY_CHARS = 2000;
const MAX_HEADINGS = 10;

const BODY_SELECTOR =
  "p, li, td, blockquote, article, section, main, div, span, h4, h5, h6";

const JUNK = [
  "cookie",
  "subscribe",
  "sign in",
  "sign up",
  "log in",
  "advertisement",
  "recommended",
  "trending",
  "load more",
  "privacy policy",
  "terms of service",
  "accept all",
  "reject all",
  "manage preferences",
  "newsletter",
  "notifications",
];

// UTIL
function isNoise(text) {
  if (!text || text.length < MIN_BODY_LENGTH) return true;
  const t = text.toLowerCase();
  // pure numeric — view counts, timestamps, subscriber counts
  if (/^[\d\s,.:\/\-]+$/.test(t)) return true;
  // script/code fragments
  if (
    t.includes("function(") ||
    t.includes("sml.load") ||
    t.includes("window.")
  )
    return true;
  return JUNK.some((p) => t.includes(p));
}

function extractContent() {
  try {
    const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
      .map((h) => h.innerText.trim())
      .filter((h) => h.length > 0)
      .slice(0, MAX_HEADINGS);

    // Step 1: collect all candidate elements with meaningful text
    const candidates = Array.from(document.querySelectorAll(BODY_SELECTOR))
      .map((el) => el.innerText.trim().replace(/\s+/g, " ").replace(/\t/g, ""))
      .filter((text) => !isNoise(text));

    candidates.sort((a, b) => b.length - a.length);

    const accepted = [];
    for (const text of candidates) {
      const alreadyCovered = accepted.some((a) => a.includes(text));
      if (!alreadyCovered) {
        accepted.push(text);
      }
    }

    const body = accepted.join(" ").slice(0, MAX_BODY_CHARS);

    return { headings, body };
  } catch (err) {
    console.log("MindMirror: extraction error", err);
    return { headings: [], body: "" };
  }
}

// SEND
// Pure fire-and-forget push. background.js owns all dedup/diff logic.
// content.js has no state — just scrape and send every time.
function sendContent(contentType) {
  const content = extractContent();

  if (content.headings.length === 0 && content.body.length === 0) {
    console.log("MindMirror: nothing to extract on", location.href);
    return;
  }

  chrome.runtime.sendMessage(
    {
      type: "EXTRACTED_CONTENT",
      payload: { url: location.href, contentType, content },
    },
    (response) => {
      if (chrome.runtime.lastError) return; // tab navigated away — safe to ignore
      console.log(
        "MindMirror: content sent",
        contentType,
        response?.status ?? "",
      );
    },
  );
}

// TIMERS
let scrollTimer = null;
let intervalTimer = null;

function startTimers() {
  clearTimeout(scrollTimer);
  clearInterval(intervalTimer);

  // 5s after load — captures content after user's first scroll
  scrollTimer = setTimeout(() => {
    sendContent("update");

    // then every 5min for long sessions — background will diff and discard if same
    intervalTimer = setInterval(() => sendContent("update"), LONG_SESSION_MS);
  }, SCROLL_WAIT_MS);
}

function stopTimers() {
  clearTimeout(scrollTimer);
  clearInterval(intervalTimer);
  scrollTimer = null;
  intervalTimer = null;
}

// MUTATION OBSERVER (SPA safe)
// Same pattern as the original working code.
// Fires when DOM content changes significantly (SPA navigation).
let mutationObserver = null;
let mutationTimer = null;
function setupMutationObserver() {
  if (mutationObserver) mutationObserver.disconnect();

  mutationObserver = new MutationObserver(() => {
    clearTimeout(mutationTimer);
    mutationTimer = setTimeout(() => {
      sendContent("initial");
    }, 1000); // debounce — fires 1s after DOM stops mutating
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // safety net — fires after 10s regardless of mutations
  // ensures slow SPAs and lazy-loaded pages get one final scrape attempt
  setTimeout(() => {
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
    // final attempt — if DOM never had enough content, try once more
    sendContent("initial");
  }, 10000);
}

// VISIBILITY
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    // final snapshot before tab loses focus — reliable, fires before tab is gone
    stopTimers();
    sendContent("update");
  }

  if (document.visibilityState === "visible") {
    // tab returned to focus — restart timers for continued session
    init();
  }
});

// INIT
function init() {
  stopTimers();
  setupMutationObserver();
  startTimers();

  console.log("MindMirror: content extractor ready");
}

if (document.body) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
