import React, { useRef, useEffect } from "react";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import SourceCard from "./SourceCard.jsx";

// User Message

function UserMessage({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
        style={{
          background: "var(--primary)",
          color: "#fff",
          padding: "11px 16px",
          borderRadius: "18px 18px 4px 18px",
          fontSize: "14px",
          maxWidth: "75%",
          lineHeight: "1.6",
          boxShadow: "0 2px 12px rgba(108, 99, 255, 0.25)",
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </div>
    </div>
  );
}

// Suggestion Chip

function SuggestionChip({ url }) {
  let domain = "";
  try {
    domain = new URL(url).hostname.replace("www.", "");
  } catch {
    domain = url;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 12px",
        background: "rgba(0, 212, 170, 0.06)",
        border: "1px solid rgba(0, 212, 170, 0.35)",
        borderRadius: "20px",
        textDecoration: "none",
        color: "var(--accent)",
        fontSize: "11px",
        fontWeight: 500,
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        maxWidth: "220px",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(0, 212, 170, 0.14)";
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 212, 170, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(0, 212, 170, 0.06)";
        e.currentTarget.style.borderColor = "rgba(0, 212, 170, 0.35)";
        e.currentTarget.style.boxShadow = "none";
      }}
      title={url}
    >
      <HiArrowTopRightOnSquare size={11} style={{ flexShrink: 0 }} />
      {domain}
    </a>
  );
}

// AI Message

function AIMessage({ data, onFollowUp, isLoading }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div
        style={{
          background: "var(--bg-elevated)",
          borderLeft: "3px solid var(--primary)",
          borderRadius: "4px 18px 18px 18px",
          padding: "14px 16px",
          fontSize: "14px",
          maxWidth: "82%",
          lineHeight: "1.65",
          color: "var(--text-primary)",
        }}
      >
        {/* ✦ marker + answer */}
        <div style={{ marginBottom: "2px" }}>
          <span
            style={{
              fontSize: "11px",
              color: "var(--primary)",
              marginRight: "8px",
              opacity: 0.9,
              userSelect: "none",
            }}
          >
            ✦
          </span>
          <span style={{ whiteSpace: "pre-wrap" }}>{data.answer}</span>
        </div>

        {/* Sources */}
        {data.sources && data.sources.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--text-disabled)",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "8px",
              }}
            >
              Sources
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {data.sources.map((source, idx) => (
                <SourceCard key={idx} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {data.suggestions && data.suggestions.length > 0 && (
          <div style={{ marginTop: "14px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "8px",
              }}
            >
              ✦ Suggested Revisits
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {data.suggestions.map((url, idx) => (
                <SuggestionChip key={idx} url={url} />
              ))}
            </div>
          </div>
        )}

        {/* Follow-up questions */}
        {data.follow_up_questions && data.follow_up_questions.length > 0 && (
          <div style={{ marginTop: "14px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--text-disabled)",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "8px",
              }}
            >
              Follow-up
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {data.follow_up_questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onFollowUp(q)}
                  disabled={isLoading}
                  style={{
                    background: "transparent",
                    border: "1px dashed var(--primary)",
                    borderRadius: "16px",
                    padding: "6px 12px",
                    color: "var(--primary)",
                    fontSize: "12px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    opacity: isLoading ? 0.5 : 1,
                    fontFamily: "Inter, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading)
                      e.currentTarget.style.background = "var(--primary-glow)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading Animation

const FULL_PHRASES = [
  "Searching your history...",
  "Decrypting sessions...",
  "Retrieving matches...",
  "Generating response...",
];

const SHORT_PHRASES = ["Decrypting...", "Retrieving...", "Generating..."];

export function LoadingMessage({ messageCount }) {
  const phrases = messageCount >= 6 ? SHORT_PHRASES : FULL_PHRASES;

  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div
        style={{
          background: "var(--bg-elevated)",
          borderLeft: "3px solid var(--primary)",
          borderRadius: "4px 18px 18px 18px",
          padding: "12px 18px",
          minWidth: "180px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            color: "var(--primary)",
            marginRight: "8px",
            userSelect: "none",
          }}
        >
          ✦
        </span>
        <CyclingText phrases={phrases} />
      </div>
    </div>
  );
}

function CyclingText({ phrases }) {
  const [index, setIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      // fade out
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length);
        setVisible(true);
      }, 300);
    }, 1800);
    return () => clearInterval(interval);
  }, [phrases]);

  return (
    <span
      style={{
        fontSize: "13px",
        color: "var(--text-secondary)",
        fontStyle: "italic",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(4px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        display: "inline-block",
      }}
    >
      {phrases[index]}
    </span>
  );
}


// Message List

export default function Messages({ messages, isLoading, onFollowUp }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        paddingBottom: "8px",
      }}
    >
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.role === "user" ? (
            <UserMessage text={msg.text} />
          ) : (
            <AIMessage
              data={msg.data}
              onFollowUp={onFollowUp}
              isLoading={isLoading}
            />
          )}
        </div>
      ))}

      {isLoading && <LoadingMessage messageCount={messages.length} />}

      <div ref={bottomRef} />
    </div>
  );
}
