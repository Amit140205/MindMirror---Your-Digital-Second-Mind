import { HiArrowRight } from "react-icons/hi2";

// Slide 3 Illustration — Mini chat UI
export function ChatIllustration() {
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