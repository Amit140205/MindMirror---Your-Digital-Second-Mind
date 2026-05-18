import { useState } from "react";
import { HiXMark, HiArrowRight, HiArrowLeft } from "react-icons/hi2";
import { BsShieldLockFill, BsChatLeftTextFill } from "react-icons/bs";
import { MdBarChart, MdHistory, MdAutoAwesome } from "react-icons/md";

// Slide Definitions

const slides = [
  {
    id: "how-it-works",
    icon: <MdAutoAwesome size={24} style={{ color: "var(--primary)" }} />,
    title: "Welcome to MindMirror",
    subtitle: "Your personal browsing assistant",
    highlight: null,
    content: (
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "13px",
          lineHeight: "1.7",
        }}
      >
        <p>
          MindMirror runs quietly in the background, tracking the websites you
          visit.
        </p>
        <br />
        <p>
          When you're ready, just ask anything — MindMirror searches your
          personal history and answers in natural language.
        </p>
        <br />
        <p style={{ color: "var(--text-disabled)" }}>
          No manual logging. No bookmarking. It just works.
        </p>
      </div>
    ),
  },
  {
    id: "privacy",
    icon: <BsShieldLockFill size={22} style={{ color: "var(--accent)" }} />,
    title: "Your Data, Encrypted",
    subtitle: "Privacy is not an afterthought",
    highlight: null,
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          Everything sensitive — your URLs, page titles, and browsed content —
          is encrypted with a key unique to you before it ever reaches our
          database.
        </p>
        <div
          style={{
            padding: "14px 16px",
            background: "var(--primary-glow)",
            border: "1px solid var(--primary)",
            borderRadius: "10px",
            fontSize: "12px",
            color: "var(--text-secondary)",
            lineHeight: "1.6",
          }}
        >
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>
            What this means for you:
          </span>
          <br />
          Even if our database were ever breached, your browsing data would be
          unreadable ciphertext — useless to anyone without your key.
        </div>
      </div>
    ),
  },
  {
    id: "chat",
    icon: <BsChatLeftTextFill size={20} style={{ color: "var(--primary)" }} />,
    title: "Ask Anything",
    subtitle: "Natural language search over your history",
    highlight: "chat-input",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          Type any question about your browsing in plain English. MindMirror
          finds the answer from your personal history.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            "What was I reading about React yesterday?",
            "Which ecom sites did I visit this week?",
            "Summarize that AI article I read today",
          ].map((q, i) => (
            <div
              key={i}
              style={{
                padding: "8px 14px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontStyle: "italic",
              }}
            >
              "{q}"
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "analytics",
    icon: <MdBarChart size={24} style={{ color: "var(--accent)" }} />,
    title: "Understand Your Habits",
    subtitle: "Visual insights into your browsing",
    highlight: "analytics-btn",
    content: (
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "13px",
          lineHeight: "1.7",
        }}
      >
        <p>
          Switch to Analytics from the sidebar to see visual breakdowns of your
          browsing — top domains, peak hours, time spent, and more.
        </p>
        <br />
        <p>
          Filter by today, this week, this month, or this year. Your data,
          visualized.
        </p>
      </div>
    ),
  },
  {
    id: "persistence",
    icon: <MdHistory size={24} style={{ color: "var(--primary)" }} />,
    title: "Your Chats Persist",
    subtitle: "We remember your session",
    highlight: null,
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          Close this tab and reopen it — your conversation will still be here.
        </p>
        <div
          style={{
            padding: "12px 16px",
            background: "#FF6B6B11",
            border: "1px solid #FF6B6B33",
            borderRadius: "8px",
            fontSize: "12px",
            color: "var(--accent-secondary)",
            lineHeight: "1.6",
          }}
        >
          ⚠️ For your privacy, fully closing the browser wipes the conversation
          permanently. Your browsing history in the database remains safe and
          encrypted.
        </div>
      </div>
    ),
  },
];

// ── Modal Position Per Highlight ──────────────────────────────────────────────
// Maps highlight id → modal position style
// null highlight → centered

function getModalPosition(highlight) {
  switch (highlight) {
    case "chat-input":
      return { bottom: "160px", left: "50%", transform: "translateX(-50%)" };
    case "analytics-btn":
      return { top: "100px", left: "260px" };
    default:
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  }
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TutorialModal({
  isOpen,
  currentSlide,
  onSlideChange,
  onClose,
}) {
  const [slideClass, setSlideClass] = useState("slide-enter-right");

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === slides.length - 1;

  const goToSlide = (direction) => {
    setSlideClass(
      direction === "next" ? "slide-enter-right" : "slide-enter-left",
    );
    onSlideChange(direction === "next" ? currentSlide + 1 : currentSlide - 1);
  };

  const modalPosition = getModalPosition(slide.highlight);

  return (
    <div
      className="tutorial-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Card */}
      <div
        className="tutorial-modal"
        style={{
          position: "absolute",
          ...modalPosition,
          width: "100%",
          maxWidth: "460px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow:
            "0 32px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(108,99,255,0.15)",
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
          transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* Progress dots */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {slides.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentSlide ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  backgroundColor:
                    i === currentSlide ? "var(--primary)" : "var(--border)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--text-disabled)",
              letterSpacing: "0.5px",
            }}
          >
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={onClose}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent-secondary)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "var(--accent-secondary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-elevated)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <HiXMark size={14} />
          </button>
        </div>

        {/* Slide Body */}
        <div
          key={currentSlide}
          className={slideClass}
          style={{ padding: "24px 24px 0" }}
        >
          {/* Title Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {slide.icon}
            </div>
            <div>
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: "1.2",
                }}
              >
                {slide.title}
              </h2>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                }}
              >
                {slide.subtitle}
              </p>
            </div>
          </div>

          {/* Content */}
          {slide.content}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            marginTop: "8px",
          }}
        >
          <button
            onClick={() => goToSlide("prev")}
            disabled={isFirst}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: isFirst ? "var(--text-disabled)" : "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: isFirst ? "not-allowed" : "pointer",
              opacity: isFirst ? 0.4 : 1,
              fontFamily: "Inter, sans-serif",
              transition: "all 0.15s ease",
            }}
          >
            <HiArrowLeft size={14} />
            Previous
          </button>

          <button
            onClick={isLast ? onClose : () => goToSlide("next")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 0 16px var(--primary-glow)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--primary)")
            }
          >
            {isLast ? "Let's go 🚀" : "Next"}
            {!isLast && <HiArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
