import { useState, useEffect } from "react"
import { HiXMark, HiArrowRight, HiArrowLeft } from "react-icons/hi2"
import { BsShieldLockFill, BsChatLeftTextFill } from "react-icons/bs"
import { RiArrowGoBackFill } from "react-icons/ri"
import { MdHistory, MdBarChart, MdSearch } from "react-icons/md"

// ─── Slide content definitions ───────────────────────────────────────────────

const slides = [
  {
    id: 1,
    icon: <MdSearch size={24} style={{ color: "var(--primary)" }} />,
    title: "The Search Bar",
    subtitle: "Your gateway to your digital second mind",
    content: (
      <div style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6" }}>
        Type your queries down here. You can ask anything about the websites you've visited, articles you've read, or research you've done. MindMirror will search your encrypted browsing history to find exactly what you're looking for.
      </div>
    ),
  },
  {
    id: 2,
    icon: <RiArrowGoBackFill size={22} style={{ color: "var(--accent)" }} />,
    title: "The Back Button",
    subtitle: "Return to the extension home anytime",
    content: (
      <div style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6" }}>
        Clicking this button will close the full-screen Chat Tab and take you back to your regular browsing. You can always reopen the chat by clicking the MindMirror icon in your Chrome toolbar.
      </div>
    ),
  },
  {
    id: 3,
    icon: <BsChatLeftTextFill size={20} style={{ color: "var(--primary)" }} />,
    title: "The Chat Interface",
    subtitle: "Where the magic happens",
    content: (
      <div style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6" }}>
        Your messages will appear on the right, and MindMirror's AI responses will appear on the left. The AI will synthesize your past browsing data to give you accurate, personalized answers.
      </div>
    ),
  },
  {
    id: 4,
    icon: <MdBarChart size={24} style={{ color: "var(--accent)" }} />,
    title: "Analytics (Coming Soon)",
    subtitle: "Visualize your browsing habits",
    content: (
      <div style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6" }}>
        This navigation menu will allow you to switch to the Analytics dashboard, where you can see visualizations of your browsing time, most visited domains, and knowledge graphs.
      </div>
    ),
  },
  {
    id: 5,
    icon: <MdHistory size={24} style={{ color: "var(--primary)" }} />,
    title: "Your Chats Persist",
    subtitle: "We remember your session until you close Chrome",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6" }}>
          If you close this tab and reopen it later, your conversation will still be here!
        </div>
        {/* Warning note */}
        <div style={{
          marginTop: "6px",
          padding: "12px 16px",
          background: "#FF6B6B11",
          border: "1px solid #FF6B6B33",
          borderRadius: "8px",
          fontSize: "13px",
          color: "var(--accent-secondary)",
          lineHeight: "1.5",
        }}>
          ⚠️ However, for your privacy, if you fully close the Chrome browser or restart your computer, the conversation will be permanently wiped.
        </div>
      </div>
    ),
  },
]

// ─── Main Modal Component ─────────────────────────────────────────────────────

export default function TutorialModal({ isOpen, currentSlide, onSlideChange, onClose }) {
  const [slideClass, setSlideClass] = useState("slide-enter-right")

  if (!isOpen) return null

  const goToSlide = (direction) => {
    setSlideClass(direction === "next" ? "slide-enter-right" : "slide-enter-left")
    onSlideChange(direction === "next" ? currentSlide + 1 : currentSlide - 1)
  }

  const slide = slides[currentSlide]
  const isFirst = currentSlide === 0
  const isLast = currentSlide === slides.length - 1

  // Determine dynamic positioning to place modal beside the spotlighted component
  const getModalPosition = () => {
    switch (currentSlide) {
      case 0: // Input search bar at bottom
        return { bottom: "100px", left: "50%", transform: "translateX(-50%)" }
      case 1: // Back button at top left
        return { top: "80px", left: "24px" }
      case 2: // Chat interface in center right
        return { top: "50%", right: "40px", transform: "translateY(-50%)" }
      case 3: // Analytics button mid left
        return { top: "100px", left: "300px" }
      case 4: // Persistence info (no highlight)
      default:
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
    }
  }

  return (
    /* Backdrop */
    <div
      className="tutorial-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 1000,
        pointerEvents: "auto" // Capture clicks so user can't click background
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal Card */}
      <div
        className="tutorial-modal"
        style={{
          position: "absolute",
          ...getModalPosition(),
          width: "100%",
          maxWidth: "480px", // slightly narrower so it fits beside things nicely
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "0 32px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(108,99,255,0.15)",
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
          transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)", // smooth movement
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px 12px",
          borderBottom: "1px solid var(--border)",
        }}>
          {/* Slide counter dots */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {slides.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentSlide ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  backgroundColor: i === currentSlide ? "var(--primary)" : "var(--border)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Slide counter text */}
          <span style={{
            fontSize: "11px",
            fontWeight: 500,
            color: "var(--text-disabled)",
            letterSpacing: "0.5px",
          }}>
            {currentSlide + 1} / {slides.length}
          </span>

          {/* Close */}
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
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "var(--accent-secondary)"
              e.currentTarget.style.color = "#fff"
              e.currentTarget.style.borderColor = "var(--accent-secondary)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "var(--bg-elevated)"
              e.currentTarget.style.color = "var(--text-secondary)"
              e.currentTarget.style.borderColor = "var(--border)"
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
          {/* Slide Title Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {slide.icon}
            </div>
            <div>
              <h2 style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: "1.2",
              }}>
                {slide.title}
              </h2>
              <p style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                marginTop: "4px",
              }}>
                {slide.subtitle}
              </p>
            </div>
          </div>

          {/* Slide Visual Content */}
          <div>
            {slide.content}
          </div>
        </div>

        {/* Modal Footer — Navigation */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          marginTop: "8px",
        }}>
          {/* Previous */}
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
              transition: "all 0.15s ease",
              fontFamily: "Inter, sans-serif",
              opacity: isFirst ? 0.4 : 1,
            }}
          >
            <HiArrowLeft size={14} />
            Previous
          </button>

          {/* Next / Got it */}
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
              transition: "all 0.15s ease",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 0 16px var(--primary-glow)",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--primary-hover)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--primary)"}
          >
            {isLast ? "Got it 🎉" : "Next"}
            {!isLast && <HiArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
