export default function StorageWarning() {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "#FFB34711",
        border: "1px solid #FFB34744",
        borderRadius: "10px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
      <div>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#FFB347",
            marginBottom: "4px",
          }}
        >
          Browser Data Warning
        </p>
        <p
          style={{
            fontSize: "11px",
            color: "var(--text-secondary)",
            lineHeight: "1.6",
          }}
        >
          Your ignored domain preferences are synced to the cloud and will
          persist across devices. Local browser data and the cloud stay in sync
          automatically on each login.
        </p>
      </div>
    </div>
  );
}
