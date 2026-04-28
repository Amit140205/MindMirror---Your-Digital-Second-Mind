
import { BsLightningChargeFill } from "react-icons/bs"
import Navbar from "../components/Navbar"

export default function Status() {
  const handleOpenChat = async () => {
    // check if chat tab already open
    const tabs = await chrome.tabs.query({
      url: chrome.runtime.getURL("newtab.html")
    })

    if (tabs.length > 0) {
      // already open — focus it
      await chrome.tabs.update(tabs[0].id, { active: true })
      await chrome.windows.update(tabs[0].windowId, { focused: true })
    } else {
      // not open — create it
      await chrome.tabs.create({
        url: chrome.runtime.getURL("newtab.html")
      })
    }

    // close popup after opening chat
    window.close()
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <Navbar />

      {/* Body */}
      <div className="flex flex-col px-6 py-8 gap-6">

        {/* Tracking Status */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg border"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border)"
          }}
        >
          {/* Pulsing Dot */}
          <div className="relative flex items-center justify-center">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--accent)" }}
            />
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Tracking Active
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Your browsing is being recorded
            </p>
          </div>
        </div>

        {/* Open Chat Button */}
        <button
          onClick={handleOpenChat}
          className="w-full flex items-center justify-center gap-2
                     px-4 py-3 rounded-lg text-sm font-semibold
                     transition-opacity hover:opacity-90 active:opacity-70"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--text-primary)",
            boxShadow: "0 0 20px var(--primary-glow)"
          }}
        >
          <BsLightningChargeFill size={14} />
          Open MindMirror Chat
        </button>

      </div>
    </div>
  )
}