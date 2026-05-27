import { useState, useEffect } from "react"

const TIPS = [
  "What did I research yesterday?",
  "How much time did I spend on YouTube this week?",
  "What articles was I reading about React?",
  "Show me everything I browsed today",
  "What was that article I read about AI last week?",
]

export default function TipRotator() {
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
    <div>
      <p style={{
        fontSize: "9px",
        color: "var(--text-disabled)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        margin: "0 0 8px",
      }}>
        Try asking
      </p>
      <div style={{
        padding: "10px 12px",
        borderRadius: "10px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minHeight: "40px",
      }}>
        <span style={{ fontSize: "12px", color: "var(--primary)", flexShrink: 0 }}>✦</span>
        <p style={{
          fontSize: "12px",
          color: "var(--text-secondary)",
          fontStyle: "italic",
          margin: 0,
          lineHeight: "1.5",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}>
          "{TIPS[index]}"
        </p>
      </div>
    </div>
  )
}