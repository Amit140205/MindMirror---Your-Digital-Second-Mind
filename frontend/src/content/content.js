// CONFIG
const SCROLL_WAIT_MS = 5000;
const LONG_SESSION_MS = 5 * 60 * 1000;
const MIN_BODY_LENGTH = 100;
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

// Sensitive field detection
function hasSensitiveFields() {
  const inputs = Array.from(document.querySelectorAll("input, select, textarea"));

  // Attribute-based detection (type, name, id, autocomplete, placeholder)
  const SENSITIVE_TYPES = new Set(["password", "tel"]);

  const SENSITIVE_ATTR_PATTERNS = [
    // Card & payment
    /card.?number/i,
    /card.?no/i,
    /cvv/i,
    /cvc/i,
    /expir/i,
    /credit.?card/i,
    /debit.?card/i,
    /card.?holder/i,
    /billing/i,
    /payment/i,
    /bank.?account/i,
    /account.?number/i,
    /routing/i,
    /ifsc/i,
    /micr/i,
    /upi/i,
    /\bpin\b/i,
    // Credentials
    /passw/i,
    /passwd/i,
    /secret/i,
    /otp/i,
    /one.?time/i,
    /two.?factor/i,
    /2fa/i,
    /mfa/i,
    /verification.?code/i,
    /auth.?code/i,
    /token/i,
    // Identity
    /ssn/i,
    /social.?security/i,
    /aadhar/i,
    /aadhaar/i,
    /pan.?number/i,
    /passport/i,
    /national.?id/i,
    /date.?of.?birth/i,
    /dob/i,
  ];

  // Autocomplete values that signal sensitive inputs
  const SENSITIVE_AUTOCOMPLETE = new Set([
    "cc-number",
    "cc-csc",
    "cc-exp",
    "cc-exp-month",
    "cc-exp-year",
    "cc-name",
    "cc-type",
    "current-password",
    "new-password",
    "one-time-code",
  ]);

  for (const input of inputs) {
    const type = (input.type || "").toLowerCase();
    const name = (input.name || "").toLowerCase();
    const id = (input.id || "").toLowerCase();
    const placeholder = (input.placeholder || "").toLowerCase();
    const autocomplete = (input.getAttribute("autocomplete") || "").toLowerCase();
    const ariaLabel = (input.getAttribute("aria-label") || "").toLowerCase();

    if (SENSITIVE_TYPES.has(type)) return true;
    if (SENSITIVE_AUTOCOMPLETE.has(autocomplete)) return true;

    const combined = `${name} ${id} ${placeholder} ${ariaLabel}`;
    if (SENSITIVE_ATTR_PATTERNS.some((rx) => rx.test(combined))) return true;
  }

  return false;
}

// UTIL

function isNoise(text) {
  if (!text || text.length < MIN_BODY_LENGTH) return true;
  const t = text.toLowerCase();
  if (/^[\d\s,.:\/\-]+$/.test(t)) return true;
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
// Checks for sensitive fields before scraping. If found, sends nothing.
function sendContent(contentType) {
  // Guard: do not scrape pages that have sensitive input fields
  if (hasSensitiveFields()) {
    console.log(
      "MindMirror: sensitive fields detected — skipping scrape for",
      location.href,
    );
    return;
  }

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
      if (chrome.runtime.lastError) return;
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

  scrollTimer = setTimeout(() => {
    sendContent("update");
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
let mutationObserver = null;
let mutationTimer = null;

function setupMutationObserver() {
  if (mutationObserver) mutationObserver.disconnect();

  mutationObserver = new MutationObserver(() => {
    clearTimeout(mutationTimer);
    mutationTimer = setTimeout(() => {
      sendContent("initial");
    }, 1000);
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  setTimeout(() => {
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
    sendContent("initial");
  }, 10000);
}

// VISIBILITY

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    stopTimers();
    sendContent("update");
  }

  if (document.visibilityState === "visible") {
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