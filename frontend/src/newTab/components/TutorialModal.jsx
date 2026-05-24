import { useState } from "react";
import { HiXMark, HiArrowRight, HiArrowLeft } from "react-icons/hi2";
import { BsShieldLockFill, BsChatLeftTextFill } from "react-icons/bs";
import { MdBarChart, MdHistory, MdAutoAwesome, MdSettings, MdDeleteOutline } from "react-icons/md";
import { HowItWorksIllustration } from "./tutorial/HowItWorksIllustration";
import { EncryptionIllustration } from "./tutorial/EncryptionIllustration";
import { ChatIllustration } from "./tutorial/ChatIllustration";
import { AnalyticsIllustration } from "./tutorial/AnalyticsIllustration";
import { PersistenceIllustration } from "./tutorial/PersistenceIllustration";
import { IgnoredDomainsIllustration } from "./tutorial/IgnoredDomainsIllustration";
import { ClearHistoryIllustration } from "./tutorial/ClearHistoryIllustration";

// Slide Definitions

const slides = [
  {
    id: "how-it-works",
    icon: <MdAutoAwesome size={22} style={{ color: "var(--primary)" }} />,
    title: "Welcome to MindMirror",
    subtitle: "Your personal browsing assistant",
    description: "MindMirror runs quietly in the background. When you're ready, ask anything — it finds the answer from your personal browsing history. No manual logging. No bookmarking.",
    illustration: <HowItWorksIllustration />,
  },
  {
    id: "privacy",
    icon: <BsShieldLockFill size={20} style={{ color: "var(--accent)" }} />,
    title: "Your Data, Encrypted",
    subtitle: "Privacy is not an afterthought",
    description: "Sensitive fields — your URLs, titles, and page content — are encrypted with a key unique to you before reaching our database. Even a breach would expose unreadable ciphertext.",
    illustration: <EncryptionIllustration />,
  },
  {
    id: "chat",
    icon: <BsChatLeftTextFill size={18} style={{ color: "var(--primary)" }} />,
    title: "Ask Anything",
    subtitle: "Natural language over your history",
    description: "Type any question in plain English. MindMirror searches, decrypts, and answers from your personal browsing — not the web.",
    illustration: <ChatIllustration />,
  },
  {
    id: "analytics",
    icon: <MdBarChart size={22} style={{ color: "var(--accent)" }} />,
    title: "Understand Your Habits",
    subtitle: "Visual insights into your browsing",
    description: "Switch to Analytics from the sidebar. Filter by today, week, month, or year. See top domains, peak hours, time spent, and more.",
    illustration: <AnalyticsIllustration />,
  },
  {
    id: "persistence",
    icon: <MdHistory size={22} style={{ color: "var(--primary)" }} />,
    title: "Your Chats Persist",
    subtitle: "We remember your session",
    description: "Close this tab and reopen it — your conversation will still be here. Fully closing the browser wipes the chat for your privacy.",
    illustration: <PersistenceIllustration />,
  },
  {
    id: "ignored-domains",
    icon: <MdSettings size={22} style={{ color: "var(--accent)" }} />,
    title: "Your Browsing, Your Rules",
    subtitle: "Block any site from being tracked",
    description: "Add domains you never want captured — social media, banking, or any personal site. MindMirror will never record sessions from those domains. Find this in Settings.",
    illustration: <IgnoredDomainsIllustration />,
  },
  {
    id: "clear-history",
    icon: <MdDeleteOutline size={22} style={{ color: "var(--accent-secondary)" }} />,
    title: "Full Control Over Your Data",
    subtitle: "Delete everything, anytime",
    description: "Your data belongs to you. Clear your entire browsing history from our servers with one click — no questions asked. Find this in Settings.",
    illustration: <ClearHistoryIllustration />,
  },
];

// Main Component

export default function TutorialModal({ isOpen, currentSlide, onSlideChange, onClose }) {
  const [slideDir, setSlideDir] = useState("right");

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === slides.length - 1;

  const goToSlide = (direction) => {
    setSlideDir(direction === "next" ? "right" : "left");
    onSlideChange(direction === "next" ? currentSlide + 1 : currentSlide - 1);
  };

  return (
    <div
      className="tutorial-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal Card — always centered, max height capped so it never overflows */}
      <div
        className="tutorial-modal"
        style={{
          width: "100%",
          maxWidth: "480px",
          maxHeight: "calc(100vh - 40px)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "0 32px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(108,99,255,0.15)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          {/* Progress dots */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {slides.map((_, i) => (
              <div key={i} style={{
                width: i === currentSlide ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                backgroundColor: i === currentSlide ? "var(--primary)" : "var(--border)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => {
                setSlideDir(i > currentSlide ? "right" : "left");
                onSlideChange(i);
              }}
              />
            ))}
          </div>

          <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-disabled)", letterSpacing: "0.5px" }}>
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={onClose}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              width: "28px", height: "28px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "var(--accent-secondary)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "var(--accent-secondary)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "var(--bg-elevated)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <HiXMark size={14} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          key={currentSlide}
          className={slideDir === "right" ? "slide-enter-right" : "slide-enter-left"}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Title Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "42px", height: "42px",
              borderRadius: "12px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {slide.icon}
            </div>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", lineHeight: "1.2" }}>
                {slide.title}
              </h2>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "3px" }}>
                {slide.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            lineHeight: "1.7",
          }}>
            {slide.description}
          </p>

          {/* Illustration */}
          {slide.illustration}
        </div>

        {/* Footer */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <button
            onClick={() => goToSlide("prev")}
            disabled={isFirst}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: isFirst ? "var(--text-disabled)" : "var(--text-secondary)",
              fontSize: "12px", fontWeight: 500,
              cursor: isFirst ? "not-allowed" : "pointer",
              opacity: isFirst ? 0.4 : 1,
              fontFamily: "Inter, sans-serif",
              transition: "all 0.15s ease",
            }}
          >
            <HiArrowLeft size={13} />
            Previous
          </button>

          <button
            onClick={isLast ? onClose : () => goToSlide("next")}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: "12px", fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 0 16px var(--primary-glow)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--primary-hover)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--primary)"}
          >
            {isLast ? "Let's go 🚀" : "Next"}
            {!isLast && <HiArrowRight size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}