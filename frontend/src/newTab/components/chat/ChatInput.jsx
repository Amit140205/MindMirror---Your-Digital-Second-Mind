import { BsArrowUpCircleFill } from "react-icons/bs";

export default function ChatInput({
  inputText,
  setInputText,
  onSend,
  isLoading,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 24px 28px 24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "var(--bg-surface)",
          border: `1px solid ${isLoading ? "var(--border)" : "var(--primary)"}`,
          borderRadius: "24px",
          padding: "8px 8px 8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: isLoading ? "none" : "0 8px 32px rgba(108, 99, 255, 0.12)",
          transition: "all 0.3s ease",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        <input
          type="text"
          placeholder="e.g., What was I searching yesterday?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
          }}
        />
        <button
          onClick={onSend}
          disabled={isLoading || !inputText.trim()}
          style={{
            background:
              isLoading || !inputText.trim()
                ? "var(--border)"
                : "var(--primary)",
            border: "none",
            borderRadius: "16px",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isLoading || !inputText.trim() ? "not-allowed" : "pointer",
            color:
              isLoading || !inputText.trim() ? "var(--text-disabled)" : "#fff",
            transition: "transform 0.1s ease, background 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!isLoading && inputText.trim())
              e.currentTarget.style.backgroundColor = "var(--primary-hover)";
          }}
          onMouseLeave={(e) => {
            if (!isLoading && inputText.trim())
              e.currentTarget.style.backgroundColor = "var(--primary)";
          }}
          onMouseDown={(e) => {
            if (!isLoading && inputText.trim())
              e.currentTarget.style.transform = "scale(0.93)";
          }}
          onMouseUp={(e) => {
            if (!isLoading && inputText.trim())
              e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <BsArrowUpCircleFill size={19} />
        </button>
      </div>
      <p
        style={{
          marginTop: "10px",
          fontSize: "11px",
          color: "var(--text-disabled)",
          textAlign: "center",
        }}
      >
        MindMirror AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
