// removing fixed interval method and add an observer that observes DOM and fires

function extractContent() {
  try {
    const headingElements = document.querySelectorAll("h1, h2, h3")
    const headings = Array.from(headingElements)
      .map((h) => h.innerText.trim())
      .filter((h) => h.length > 0)
      .slice(0, 10)

    const bodyClones = document.querySelectorAll(
      "p, li, td, blockquote, article"
    )
    const bodyText = Array.from(bodyClones)
      .map((el) => el.innerText.trim())
      .filter((text) => text.length > 80)
      .join(" ")
      .replace(/\s+/g, " ")
      .replace(/\t/g, "")
      .slice(0, 2000)

    return { headings, body: bodyText }

  } catch (error) {
    console.log("MindMirror: extraction error", error)
    return { headings: [], body: "" }
  }
}

// extraction logic

let extractionDone = false
let observer = null

function sendExtractedContent() {
  if (extractionDone) return

  const content = extractContent()

  if (content.headings.length === 0 && content.body.length === 0) {
    console.log("MindMirror: nothing to extract on", window.location.href)
    return
  }

  chrome.runtime.sendMessage({
    type: "EXTRACTED_CONTENT",
    payload: {
      url: window.location.href,
      content: content
    }
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.log("MindMirror: message error", chrome.runtime.lastError)
      return
    }
    if (response?.success) {
      extractionDone = true
      // stop observing once extraction succeeds
      if (observer) {
        observer.disconnect()
        observer = null
      }
      console.log("MindMirror: content extracted and sent")
    }
  })
}

function hasEnoughContent() {
  const elements = document.querySelectorAll("p, li, article")
  const meaningful = Array.from(elements)
    .filter(el => el.innerText.trim().length > 80)
  return meaningful.length > 3
}

function startObserver() {
  if (observer) return

  observer = new MutationObserver(() => {
    if (hasEnoughContent()) {
      sendExtractedContent()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  // safety timeout — stop observing after 8 seconds
  setTimeout(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    // last attempt regardless
    if (!extractionDone) {
      sendExtractedContent()
    }
  }, 8000)
}

// attempt 1 — immediate for static sites like wikipedia
sendExtractedContent()

// if not done, start observing DOM for dynamic content
if (!extractionDone) {
  startObserver()
}

// reset and retry when user returns to this tab
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && extractionDone) {
    extractionDone = false
    // restart observer for fresh extraction
    startObserver()
  }
})