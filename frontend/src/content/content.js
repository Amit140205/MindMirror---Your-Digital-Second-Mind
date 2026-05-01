function extractContent() {
  try {
    // extract headings
    const headingElements = document.querySelectorAll("h1, h2, h3");
    const headings = Array.from(headingElements)
      .map((h) => h.innerText.trim())
      .filter((h) => h.length > 0)
      .slice(0, 10); // max 10 headings

    // extract body text
    const bodyClones = document.querySelectorAll("p, li, td, blockquote");
    const bodyText = Array.from(bodyClones)
      .map((el) => el.innerText.trim())
      .filter((text) => text.length > 80)
      .join(" ")
      .replace(/\s+/g, " ")
      .replace(/\t/g, "")
      .slice(0, 2000);

    return {
      headings,
      body: bodyText,
    };
  } catch (error) {
    console.log("MindMirror: extraction error", error);
    return { headings: [], body: "" };
  }
}

let extractionDone = false

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
      console.log("MindMirror: content extracted and sent", response)
    }
  })
}

// first attempt immediately
sendExtractedContent()

// second attempt only if first failed or got empty content
setTimeout(() => {
  if (!extractionDone) {
    sendExtractedContent()
  }
}, 2000)

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && extractionDone) {
    extractionDone = false
    setTimeout(() => {
      sendExtractedContent()
    }, 1500)
  }
})