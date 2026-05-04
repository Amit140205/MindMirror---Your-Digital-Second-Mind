import { useState } from "react"
import { useSelector } from "react-redux"
import { HiArrowLeft } from "react-icons/hi2"
import { HiSparkles } from "react-icons/hi2"

export default function ChatNavbar({ onTutorialOpen, isTutorialOpen, tutorialSlide }) {
  const user = useSelector(state => state.user.userData)

  const getInitial = (name) => {
    if (!name) return "?"
    return name.charAt(0).toUpperCase()
  }

  const handleBack = async () => {
    const tab = await chrome.tabs.getCurrent()
    chrome.tabs.remove(tab.id)
  }

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "60px",
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Left — Back Button */}
      <button
        onClick={handleBack}
        className={`back-btn ${isTutorialOpen && tutorialSlide === 1 ? "tutorial-highlight" : ""}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "8px",
          border: "none",
          background: "transparent",
          color: "var(--text-secondary)",
          fontSize: "13px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "background 0.15s ease, color 0.15s ease",
          fontFamily: "Inter, sans-serif",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = "var(--bg-elevated)"
          e.currentTarget.style.color = "var(--text-primary)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = "transparent"
          e.currentTarget.style.color = "var(--text-secondary)"
        }}
      >
        <HiArrowLeft size={16} />
        Home
      </button>

      {/* Center — Branding */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
      }}>
        <img src="/icons/icon.png" alt="MindMirror" style={{ width: "20px", height: "20px" }} />
        <span style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "-0.3px",
          fontFamily: "Inter, sans-serif",
        }}>
          MindMirror
        </span>
      </div>

      {/* Right — User Profile + Tutorial Button */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        {/* User Avatar + Name (non-clickable) */}
        {user && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: "var(--primary)",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 600,
              flexShrink: 0,
              boxShadow: "0 0 10px var(--primary-glow)",
            }}>
              {getInitial(user.userName)}
            </div>
            <span style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              fontFamily: "Inter, sans-serif",
              maxWidth: "120px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {user.userName}
            </span>
          </div>
        )}

        {/* Divider */}
        <div style={{
          width: "1px",
          height: "20px",
          backgroundColor: "var(--border)",
        }} />

        {/* Tutorial Button */}
        <button
          onClick={onTutorialOpen}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid var(--primary)",
            background: "var(--primary-glow)",
            color: "var(--primary)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "var(--primary)"
            e.currentTarget.style.color = "#fff"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "var(--primary-glow)"
            e.currentTarget.style.color = "var(--primary)"
          }}
        >
          <HiSparkles size={13} />
          How it works
        </button>
      </div>
    </nav>
  )
}
