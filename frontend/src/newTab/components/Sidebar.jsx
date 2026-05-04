import { MdBarChart } from "react-icons/md"

export default function Sidebar({ isTutorialOpen, tutorialSlide }) {
  return (
    <div style={{
      width: "260px",
      backgroundColor: "var(--bg-surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "16px 12px",
      flexShrink: 0,
    }}>
      <h3 style={{
        fontSize: "12px",
        fontWeight: 600,
        color: "var(--text-disabled)",
        marginBottom: "12px",
        paddingLeft: "8px",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
      }}>
        Navigation
      </h3>

      {/* Analytics Navigation Button */}
      <div 
        className={isTutorialOpen && tutorialSlide === 3 ? "tutorial-highlight" : ""}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 12px",
          borderRadius: "8px",
          cursor: "pointer",
          color: "var(--text-secondary)",
          transition: "all 0.2s ease",
          fontSize: "13px",
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--bg-elevated)"
          e.currentTarget.style.color = "var(--text-primary)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent"
          e.currentTarget.style.color = "var(--text-secondary)"
        }}
      >
        <MdBarChart size={18} style={{ color: "var(--accent)" }} />
        <span>Analytics</span>
      </div>
    </div>
  )
}
