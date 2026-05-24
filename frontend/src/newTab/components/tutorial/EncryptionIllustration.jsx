// Slide 2 Illustration — Encryption visual
export function EncryptionIllustration() {
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
      {/* Row — plain field */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          padding: "5px 10px",
          borderRadius: "6px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          fontSize: "10px",
          color: "var(--text-secondary)",
          fontFamily: "monospace",
          minWidth: "90px",
          textAlign: "center",
        }}>
          youtube.com
        </div>
        <div style={{ fontSize: "10px", color: "var(--text-disabled)", flexShrink: 0 }}>domain →</div>
        <div style={{
          padding: "5px 10px",
          borderRadius: "6px",
          background: "rgba(0, 212, 170, 0.08)",
          border: "1px solid rgba(0, 212, 170, 0.3)",
          fontSize: "10px",
          color: "var(--accent)",
          fontFamily: "monospace",
          flex: 1,
          textAlign: "center",
        }}>
          youtube.com ✓ plain
        </div>
      </div>

      {/* Divider with label */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span style={{ fontSize: "9px", color: "var(--text-disabled)", letterSpacing: "0.5px" }}>SENSITIVE FIELDS — ENCRYPTED</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      {/* Encrypted rows */}
      {[
        { label: "url", raw: "https://youtube.com/watch?v=..." },
        { label: "title", raw: "React Tutorial - Complete..." },
      ].map((row, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            padding: "5px 10px",
            borderRadius: "6px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            fontSize: "10px",
            color: "var(--text-secondary)",
            fontFamily: "monospace",
            minWidth: "90px",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {row.raw}
          </div>
          <div style={{ fontSize: "16px", flexShrink: 0 }}>🔒</div>
          <div style={{
            padding: "5px 10px",
            borderRadius: "6px",
            background: "rgba(108, 99, 255, 0.08)",
            border: "1px solid rgba(108, 99, 255, 0.3)",
            fontSize: "9px",
            color: "var(--primary)",
            fontFamily: "monospace",
            flex: 1,
            textAlign: "center",
            letterSpacing: "0.5px",
          }}>
            aGVsbG8gd29ybGQ...
          </div>
        </div>
      ))}
    </div>
  );
}