// Slide 6 Illustration — Ignored Domains
export function IgnoredDomainsIllustration() {
  const domains = ["youtube.com", "instagram.com"]

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
      {/* Input row */}
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{
          flex: 1,
          padding: "7px 12px",
          borderRadius: "8px",
          border: "1px solid var(--primary)",
          background: "var(--bg-elevated)",
          fontSize: "10px",
          color: "var(--text-secondary)",
          fontFamily: "monospace",
        }}>
          e.g. twitter.com
        </div>
        <div style={{
          padding: "7px 14px",
          borderRadius: "8px",
          background: "var(--primary)",
          color: "#fff",
          fontSize: "10px",
          fontWeight: 600,
        }}>
          Add
        </div>
      </div>

      {/* Domain list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {domains.map((domain, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "7px 10px",
            borderRadius: "8px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
          }}>
            <span style={{
              fontSize: "10px",
              color: "var(--text-primary)",
              fontFamily: "monospace",
            }}>
              🚫 {domain}
            </span>
            <span style={{ fontSize: "9px", color: "var(--accent-secondary)" }}>×</span>
          </div>
        ))}
      </div>

      {/* Note */}
      <div style={{
        padding: "7px 10px",
        background: "rgba(0, 212, 170, 0.06)",
        border: "1px solid rgba(0, 212, 170, 0.2)",
        borderRadius: "8px",
        fontSize: "9px",
        color: "var(--accent)",
        lineHeight: "1.5",
      }}>
        ✓ Sessions from these domains will never be captured
      </div>
    </div>
  )
}

