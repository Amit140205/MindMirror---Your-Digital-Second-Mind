export default function TrackingBadge() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 14px",
      borderRadius: "10px",
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ position: "relative", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{
            position: "absolute",
            width: "18px", height: "18px",
            borderRadius: "50%",
            background: "rgba(0, 212, 170, 0.2)",
            animation: "ping 1.5s ease-in-out infinite",
          }} />
          <span style={{
            width: "8px", height: "8px",
            borderRadius: "50%",
            background: "var(--accent)",
            position: "relative",
          }} />
        </div>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            Tracking active
          </p>
          <p style={{ fontSize: "10px", color: "var(--text-secondary)", margin: "2px 0 0" }}>
            Sessions are being recorded
          </p>
        </div>
      </div>

      <div style={{
        padding: "4px 10px",
        borderRadius: "20px",
        background: "rgba(0, 212, 170, 0.08)",
        border: "1px solid rgba(0, 212, 170, 0.2)",
        fontSize: "11px",
        color: "var(--accent)",
        fontWeight: 500,
      }}>
        Live
      </div>
    </div>
  )
}