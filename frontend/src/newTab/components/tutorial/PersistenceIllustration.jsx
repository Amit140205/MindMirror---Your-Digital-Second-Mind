// Slide 5 Illustration — Session persistence visual
export function PersistenceIllustration() {
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