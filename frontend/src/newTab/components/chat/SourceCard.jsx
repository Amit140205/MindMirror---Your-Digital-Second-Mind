import { BsClockHistory } from "react-icons/bs";

export default function SourceCard({ source }) {
  const formatTime = (ms) => {
    const s = Math.round(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
  };

  const cleanDomain = (domain) => {
    return domain.replace("www.", "");
  };

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        background: "var(--bg-primary)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        padding: "10px 12px",
        textDecoration: "none",
        color: "var(--text-primary)",
        minWidth: "140px",
        maxWidth: "190px",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.background = "var(--bg-elevated)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background = "var(--bg-primary)";
      }}
    >
      {/* Title */}
      <span
        style={{
          fontWeight: 600,
          fontSize: "12px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: "var(--text-primary)",
        }}
      >
        {source.title || cleanDomain(source.domain)}
      </span>

      {/* Domain */}
      <span
        style={{
          fontSize: "10px",
          color: "var(--primary)",
          opacity: 0.8,
        }}
      >
        {cleanDomain(source.domain)}
      </span>

      {/* Time spent */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          marginTop: "2px",
        }}
      >
        <BsClockHistory size={9} style={{ color: "var(--text-disabled)" }} />
        <span style={{ fontSize: "10px", color: "var(--text-disabled)" }}>
          {formatTime(source.timeSpent)}
        </span>
      </div>
    </a>
  );
}
