// Slide 4 Illustration — Mini analytics dashboard
export function AnalyticsIllustration() {
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