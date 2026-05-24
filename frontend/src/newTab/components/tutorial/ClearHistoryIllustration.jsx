// Slide 7 Illustration — Clear History
export function ClearHistoryIllustration() {
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
      {/* Stats row */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[
          { label: "Sessions", value: "1,284" },
          { label: "Sites tracked", value: "47" },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: "8px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
          }}>
            <p style={{ fontSize: "9px", color: "var(--text-disabled)", marginBottom: "3px" }}>{s.label}</p>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Delete button */}
      <div style={{
        padding: "8px 14px",
        borderRadius: "8px",
        border: "1px solid #FF6B6B44",
        background: "#FF6B6B11",
        fontSize: "11px",
        fontWeight: 600,
        color: "var(--accent-secondary)",
        textAlign: "center",
        cursor: "pointer",
      }}>
        Delete All History
      </div>

      {/* Confirmation */}
      <div style={{
        padding: "10px 12px",
        background: "#FF6B6B0D",
        border: "1px solid #FF6B6B33",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        <p style={{ fontSize: "10px", color: "var(--accent-secondary)", fontWeight: 600 }}>
          Are you sure? This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{
            padding: "5px 12px",
            borderRadius: "6px",
            background: "#FF6B6B",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 600,
          }}>
            Yes, Delete All
          </div>
          <div style={{
            padding: "5px 12px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            fontSize: "10px",
          }}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  )
}