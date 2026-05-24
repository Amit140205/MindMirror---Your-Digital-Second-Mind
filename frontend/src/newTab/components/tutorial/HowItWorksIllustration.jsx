import { BsClockHistory } from "react-icons/bs";

// Slide 1 Illustration — Mini browsing activity feed
export function HowItWorksIllustration() {
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