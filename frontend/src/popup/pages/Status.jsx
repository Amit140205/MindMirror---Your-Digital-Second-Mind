import { useState, useEffect } from "react"
import { BsLightningChargeFill } from "react-icons/bs"
import { MdBlock } from "react-icons/md"
import { HiArrowRight } from "react-icons/hi2"
import Navbar from "../components/Navbar"

const TIPS = [
  "What did I research yesterday?",
  "How much time did I spend on YouTube this week?",
  "What articles was I reading about React?",
  "Show me everything I browsed today",
  "What was that article I read about AI last week?",
]

function RotatingTip() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % TIPS.length)
        setVisible(true)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      padding: "12px 14px",
      borderRadius: "10px",
      background: "var(--bg-elevated)",
      border: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      minHeight: "44px",
    }}>
      <span style={{ fontSize: "13px", color: "var(--primary)", flexShrink: 0 }}>✦</span>
      <p
        style={{
          fontSize: "12px",
          color: "var(--text-secondary)",
          fontStyle: "italic",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          lineHeight: "1.5",
        }}
      >
        "{TIPS[index]}"
      </p>
    </div>
  )
}

function BlockedBadge({ count }) {
  if (count === 0) return null
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "5px 10px",
      borderRadius: "20px",
      background: "rgba(255, 107, 107, 0.08)",
      border: "1px solid rgba(255, 107, 107, 0.2)",
      fontSize: "11px",
      color: "var(--accent-secondary)",
      fontWeight: 500,
    }}>
      <MdBlock size={11} />
      {count} domain{count !== 1 ? "s" : ""} blocked
    </div>
  )
}

export default function Status() {
  const [ignoredCount, setIgnoredCount] = useState(0)

  useEffect(() => {
    chrome.storage.local.get("ignoredPatterns").then(result => {
      setIgnoredCount((result.ignoredPatterns || []).length)
    })
  }, [])

  const handleOpenChat = async () => {
    const tabs = await chrome.tabs.query({ url: chrome.runtime.getURL("newtab.html") })
    if (tabs.length > 0) {
      await chrome.tabs.update(tabs[0].id, { active: true })
      await chrome.windows.update(tabs[0].windowId, { focused: true })
    } else {
      await chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") })
    }
    window.close()
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      <Navbar />

      <div style={{ display: "flex", flexDirection: "column", padding: "20px 16px", gap: "14px" }}>

        {/* Tracking status */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px",
          borderRadius: "12px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{
                position: "absolute",
                width: "18px", height: "18px",
                borderRadius: "50%",
                background: "rgba(0, 212, 170, 0.2)",
                animation: "ping 1.5s ease-in-out infinite",
              }} />
              <span style={{
                width: "8px", height: "8px",
                borderRadius: "50%",
                background: "var(--accent)",
                position: "relative",
              }} />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Tracking Active</p>
              <p style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "1px" }}>Your browsing is being recorded</p>
            </div>
          </div>
          <BlockedBadge count={ignoredCount} />
        </div>

        {/* Divider with label */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ fontSize: "9px", color: "var(--text-disabled)", letterSpacing: "0.5px", textTransform: "uppercase" }}>Try asking</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        {/* Rotating tip */}
        <RotatingTip />

        {/* CTA */}
        <button
          onClick={handleOpenChat}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "var(--primary)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 0 24px var(--primary-glow)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--primary-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}
        >
          <BsLightningChargeFill size={13} />
          Open MindMirror Chat
          <HiArrowRight size={13} />
        </button>

      </div>

      <style>{`
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  )
}