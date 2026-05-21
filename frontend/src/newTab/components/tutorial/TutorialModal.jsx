import { useState } from "react";
import { HiXMark, HiArrowRight, HiArrowLeft } from "react-icons/hi2";
import { BsShieldLockFill, BsChatLeftTextFill, BsClockHistory } from "react-icons/bs";
import { MdBarChart, MdHistory, MdAutoAwesome } from "react-icons/md";

// ── Slide 1 Illustration — Mini browsing activity feed ────────────────────────
function HowItWorksIllustration() {
  const sites = [
    { domain: "github.com", title: "Exploring a repo...", color: "#6C63FF", time: "4m ago" },
    { domain: "stackoverflow.com", title: "Looking for answers...", color: "#00D4AA", time: "12m ago" },
    { domain: "youtube.com", title: "Watching a tutorial...", color: "#FF6B6B", time: "28m ago" },
  ];

  return (
    <div style={{
      background: "var(--bg-primary)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}>
      {/* Header bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        paddingBottom: "8px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
        <span style={{ fontSize: "10px", color: "var(--accent)", fontWeight: 600, letterSpacing: "0.5px" }}>
          TRACKING ACTIVE
        </span>
      </div>

      {/* Session rows */}
      {sites.map((site, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "7px 8px",
          borderRadius: "8px",
          background: "var(--bg-elevated)",
          opacity: 1 - i * 0.15,
        }}>
          <div style={{
            width: "28px", height: "28px",
            borderRadius: "8px",
            background: site.color + "22",
            border: `1px solid ${site.color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", flexShrink: 0,
          }}>
            🌐
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {site.domain}
            </p>
            <p style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "1px" }}>
              {site.title}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            <BsClockHistory size={9} style={{ color: "var(--text-disabled)" }} />
            <span style={{ fontSize: "10px", color: "var(--text-disabled)" }}>{site.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Slide 2 Illustration — Encryption visual ──────────────────────────────────
function EncryptionIllustration() {
  return (
    <div style={{
      background: "var(--bg-primary)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}>
      {/* Row — plain field */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          padding: "5px 10px",
          borderRadius: "6px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          fontSize: "10px",
          color: "var(--text-secondary)",
          fontFamily: "monospace",
          minWidth: "90px",
          textAlign: "center",
        }}>
          youtube.com
        </div>
        <div style={{ fontSize: "10px", color: "var(--text-disabled)", flexShrink: 0 }}>domain →</div>
        <div style={{
          padding: "5px 10px",
          borderRadius: "6px",
          background: "rgba(0, 212, 170, 0.08)",
          border: "1px solid rgba(0, 212, 170, 0.3)",
          fontSize: "10px",
          color: "var(--accent)",
          fontFamily: "monospace",
          flex: 1,
          textAlign: "center",
        }}>
          youtube.com ✓ plain
        </div>
      </div>

      {/* Divider with label */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span style={{ fontSize: "9px", color: "var(--text-disabled)", letterSpacing: "0.5px" }}>SENSITIVE FIELDS — ENCRYPTED</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      {/* Encrypted rows */}
      {[
        { label: "url", raw: "https://youtube.com/watch?v=..." },
        { label: "title", raw: "React Tutorial - Complete..." },
      ].map((row, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            padding: "5px 10px",
            borderRadius: "6px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            fontSize: "10px",
            color: "var(--text-secondary)",
            fontFamily: "monospace",
            minWidth: "90px",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {row.raw}
          </div>
          <div style={{ fontSize: "16px", flexShrink: 0 }}>🔒</div>
          <div style={{
            padding: "5px 10px",
            borderRadius: "6px",
            background: "rgba(108, 99, 255, 0.08)",
            border: "1px solid rgba(108, 99, 255, 0.3)",
            fontSize: "9px",
            color: "var(--primary)",
            fontFamily: "monospace",
            flex: 1,
            textAlign: "center",
            letterSpacing: "0.5px",
          }}>
            aGVsbG8gd29ybGQ...
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Slide 3 Illustration — Mini chat UI ───────────────────────────────────────
function ChatIllustration() {
  return (
    <div style={{
      background: "var(--bg-primary)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}>
      {/* User message */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          background: "var(--primary)",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "14px 14px 3px 14px",
          fontSize: "11px",
          maxWidth: "80%",
          lineHeight: "1.5",
        }}>
          What was I reading about React yesterday?
        </div>
      </div>

      {/* AI response */}
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div style={{
          background: "var(--bg-elevated)",
          borderLeft: "2px solid var(--primary)",
          borderRadius: "3px 14px 14px 14px",
          padding: "8px 12px",
          fontSize: "11px",
          maxWidth: "85%",
          lineHeight: "1.5",
          color: "var(--text-primary)",
        }}>
          <span style={{ color: "var(--primary)", fontSize: "9px", marginRight: "6px" }}>✦</span>
          You spent 24 minutes on the React hooks deep-dive on{" "}
          <span style={{ color: "var(--primary)" }}>react.dev</span> and watched
          a tutorial on YouTube...
        </div>
      </div>

      {/* Input bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 10px",
        borderRadius: "20px",
        border: "1px solid var(--primary)",
        background: "var(--bg-surface)",
        boxShadow: "0 4px 16px rgba(108, 99, 255, 0.1)",
      }}>
        <span style={{ flex: 1, fontSize: "10px", color: "var(--text-disabled)" }}>
          Ask anything about your browsing...
        </span>
        <div style={{
          width: "22px", height: "22px",
          borderRadius: "50%",
          background: "var(--primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <HiArrowRight size={10} color="#fff" />
        </div>
      </div>
    </div>
  );
}

// ── Slide 4 Illustration — Mini analytics dashboard ───────────────────────────
function AnalyticsIllustration() {
  const bars = [
    { domain: "github.com", pct: 85, color: "#6C63FF" },
    { domain: "youtube.com", pct: 62, color: "#00D4AA" },
    { domain: "stackoverflow.com", pct: 45, color: "#FF6B6B" },
    { domain: "react.dev", pct: 28, color: "#FFB347" },
  ];

  return (
    <div style={{
      background: "var(--bg-primary)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}>
      {/* Filter pills */}
      <div style={{ display: "flex", gap: "6px" }}>
        {["Today", "Week", "Month", "Year"].map((f, i) => (
          <div key={f} style={{
            padding: "3px 10px",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: i === 2 ? "var(--primary)" : "var(--border)",
            background: i === 2 ? "var(--primary-glow)" : "transparent",
            color: i === 2 ? "var(--primary)" : "var(--text-disabled)",
            fontSize: "9px",
            fontWeight: i === 2 ? 600 : 400,
          }}>
            {f}
          </div>
        ))}
      </div>

      {/* Stat chips */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[
          { label: "Sessions", value: "142" },
          { label: "Time", value: "6h 24m" },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: "8px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
          }}>
            <p style={{ fontSize: "9px", color: "var(--text-disabled)", marginBottom: "3px" }}>{s.label}</p>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {bars.map(b => (
          <div key={b.domain} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "9px", color: "var(--text-secondary)", width: "80px", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {b.domain}
            </span>
            <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "var(--border)", overflow: "hidden" }}>
              <div style={{
                width: `${b.pct}%`,
                height: "100%",
                borderRadius: "3px",
                background: b.color,
                opacity: 0.85,
              }} />
            </div>
            <span style={{ fontSize: "9px", color: "var(--text-disabled)", width: "24px", textAlign: "right" }}>{b.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Slide 5 Illustration — Session persistence visual ─────────────────────────
function PersistenceIllustration() {
  return (
    <div style={{
      background: "var(--bg-primary)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}>
      {/* Timeline */}
      <div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>

        {/* Step 1 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(108, 99, 255, 0.15)",
            border: "1px solid var(--primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
          }}>💬</div>
          <div style={{ width: "1px", flex: 1, background: "var(--border)", margin: "4px 0" }} />
          <p style={{ fontSize: "9px", color: "var(--text-secondary)", textAlign: "center", marginTop: "4px" }}>Chat opened</p>
        </div>

        <div style={{ width: "32px", height: "1px", background: "var(--border)", alignSelf: "center", marginBottom: "20px" }} />

        {/* Step 2 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(0, 212, 170, 0.12)",
            border: "1px solid rgba(0, 212, 170, 0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
          }}>🔖</div>
          <div style={{ width: "1px", flex: 1, background: "var(--border)", margin: "4px 0" }} />
          <p style={{ fontSize: "9px", color: "var(--text-secondary)", textAlign: "center", marginTop: "4px" }}>Tab closed</p>
        </div>

        <div style={{ width: "32px", height: "1px", background: "var(--border)", alignSelf: "center", marginBottom: "20px" }} />

        {/* Step 3 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(108, 99, 255, 0.15)",
            border: "1px solid var(--primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
          }}>✨</div>
          <div style={{ width: "1px", flex: 1, background: "var(--border)", margin: "4px 0" }} />
          <p style={{ fontSize: "9px", color: "var(--text-secondary)", textAlign: "center", marginTop: "4px" }}>Chat restored</p>
        </div>
      </div>

      {/* Warning note */}
      <div style={{
        padding: "8px 12px",
        background: "#FF6B6B0D",
        border: "1px solid #FF6B6B30",
        borderRadius: "8px",
        fontSize: "10px",
        color: "var(--accent-secondary)",
        lineHeight: "1.5",
      }}>
        ⚠️ Closing the browser fully wipes the chat. Your encrypted browsing history stays safe.
      </div>
    </div>
  );
}

// ── Slide Definitions ─────────────────────────────────────────────────────────

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
];

// ── Main Component ────────────────────────────────────────────────────────────

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