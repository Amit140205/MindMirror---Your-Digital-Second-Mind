import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, setMessages } from "../../shared/store/chatSlice.js";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { chatAPI, checkFastapiHealth } from "../../shared/api/api.js";
import toast from "react-hot-toast";

export default function ChatArea({ isTutorialOpen, tutorialSlide }) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [apiOnline, setApiOnline] = useState(true);

  // Load persisted messages from session storage on mount
  useEffect(() => {
    const init = async () => {
      // load messages
      try {
        const result = await chrome.storage.session.get("chatMessages");
        if (result.chatMessages && result.chatMessages.length > 0) {
          dispatch(setMessages(result.chatMessages));
        }
      } catch (error) {
        console.error("MindMirror: failed to load chat history", error);
      }

      // check fastapi health
      try {
        await checkFastapiHealth();
        setApiOnline(true);
      } catch {
        setApiOnline(false);
      }
    };
    init();
  }, []);

  // Sync Redux → session storage whenever messages change
  useEffect(() => {
    if (messages.length === 0) return;
    chrome.storage.session
      .set({ chatMessages: messages })
      .catch((err) =>
        console.error("MindMirror: failed to persist chat history", err),
      );
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textOverride = null) => {
    const textToSend =
      typeof textOverride === "string" ? textOverride : inputText.trim();
    if (!textToSend || isLoading) return;

    const newUserMsg = { role: "user", text: textToSend };
    dispatch(addMessage(newUserMsg));
    setInputText("");
    setIsLoading(true);

    try {
      const result = await chrome.storage.local.get("token");
      const token = result.token;

      if (!token) {
        toast.error("Authentication error. Please login again.");
        setIsLoading(false);
        return;
      }

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await chatAPI(token, textToSend, timezone);

      const newAiMsg = { role: "ai", data: response };
      dispatch(addMessage(newAiMsg));
    } catch (error) {
      console.error("Chat API Error:", error);
      toast.error("Failed to fetch response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const stripMarkdown = (text) => {
    if (!text) return "";
    const match = text.match(/\[([^\]]+)\]\([^)]+\)/);
    return match ? match[1] : text;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Tutorial mock messages so we have something to highlight on slide 2
  const isTutorialMessages =
    isTutorialOpen && tutorialSlide === 2 && messages.length === 0;
  const renderMessages = isTutorialMessages
    ? [
        { role: "user", text: "What was I searching yesterday about React?" },
        {
          role: "ai",
          data: {
            answer:
              "Yesterday, you spent 14 minutes reading about React state management...",
            sources: [],
            follow_up_questions: [],
          },
        },
      ]
    : messages;

  const showMessages = renderMessages.length > 0 || isLoading;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-primary)",
        position: "relative",
      }}
    >
      {/* MAIN CONTENT AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: showMessages ? "flex-start" : "center",
          alignItems: "center",
          padding: "24px",
          overflowY: "auto",
          gap: "16px",
        }}
      >
        {!showMessages ? (
          /* Empty State Greeting */
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              What do you want to remember?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Search through your digital second mind
            </p>
          </div>
        ) : (
          /* Active Chat Container */
          <div
            className={
              isTutorialOpen && tutorialSlide === 2 ? "tutorial-highlight" : ""
            }
            style={{
              width: "100%",
              maxWidth: "800px",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
              paddingBottom: "20px",
            }}
          >
            {renderMessages.map((msg, index) => (
              <div key={index}>
                {msg.role === "user" ? (
                  /* User Message */
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div
                      style={{
                        background: "var(--primary)",
                        color: "#fff",
                        padding: "12px 16px",
                        borderRadius: "16px 16px 4px 16px",
                        fontSize: "14px",
                        maxWidth: "80%",
                        lineHeight: "1.6",
                        boxShadow: "0 0 16px var(--primary-glow)",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  /* AI Response */
                  <div
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <div
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                        padding: "16px",
                        borderRadius: "16px 16px 16px 4px",
                        fontSize: "14px",
                        maxWidth: "85%",
                        lineHeight: "1.6",
                      }}
                    >
                      {/* AI Answer text */}
                      <div
                        style={{ whiteSpace: "pre-wrap", marginBottom: "8px" }}
                      >
                        {msg.data.answer}
                      </div>

                      {/* Render Sources if they exist */}
                      {msg.data.sources && msg.data.sources.length > 0 && (
                        <div style={{ marginTop: "16px" }}>
                          <p
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "var(--text-disabled)",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
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
                            {msg.data.sources.map((source, idx) => (
                              <a
                                key={idx}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  background: "var(--bg-primary)",
                                  border: "1px solid var(--border)",
                                  borderRadius: "8px",
                                  padding: "8px 12px",
                                  textDecoration: "none",
                                  color: "var(--text-primary)",
                                  maxWidth: "200px",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "var(--primary)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.borderColor =
                                    "var(--border)")
                                }
                              >
                                <span
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {source.title}
                                </span>
                                <span
                                  style={{
                                    color: "var(--text-secondary)",
                                    fontSize: "10px",
                                    marginTop: "4px",
                                  }}
                                >
                                  {stripMarkdown(source.domain)}
                                </span>
                                <span
                                  style={{
                                    color: "var(--text-disabled)",
                                    fontSize: "10px",
                                    marginTop: "2px",
                                  }}
                                >
                                  {Math.round(source.timeSpent / 1000)}s spent
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render Follow-up Questions if they exist */}
                      {msg.data.follow_up_questions &&
                        msg.data.follow_up_questions.length > 0 && (
                          <div style={{ marginTop: "20px" }}>
                            <p
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "var(--text-disabled)",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                marginBottom: "8px",
                              }}
                            >
                              Follow-up
                            </p>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                              }}
                            >
                              {msg.data.follow_up_questions.map((q, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setInputText(q)}
                                  disabled={isLoading}
                                  style={{
                                    background: "transparent",
                                    border: "1px dashed var(--primary)",
                                    borderRadius: "16px",
                                    padding: "6px 12px",
                                    color: "var(--primary)",
                                    fontSize: "12px",
                                    cursor: isLoading
                                      ? "not-allowed"
                                      : "pointer",
                                    transition: "all 0.2s ease",
                                    opacity: isLoading ? 0.5 : 1,
                                  }}
                                  onMouseEnter={(e) =>
                                    !isLoading &&
                                    (e.currentTarget.style.background =
                                      "var(--primary-glow)")
                                  }
                                  onMouseLeave={(e) =>
                                    !isLoading &&
                                    (e.currentTarget.style.background =
                                      "transparent")
                                  }
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    padding: "16px",
                    borderRadius: "16px 16px 16px 4px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    className="typing-dot"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="typing-dot"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="typing-dot"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            )}

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* API Offline Warning */}
      {!apiOnline && (
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto 12px",
            padding: "10px 16px",
            background: "#FF6B6B11",
            border: "1px solid #FF6B6B44",
            borderRadius: "10px",
            fontSize: "12px",
            color: "var(--accent-secondary)",
            textAlign: "center",
          }}
        >
          ⚠️ AI service is currently unreachable. Please try again later.
        </div>
      )}

      {/* INPUT AREA */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 24px 32px 24px",
        }}
      >
        <div
          className={
            isTutorialOpen && tutorialSlide === 0 ? "tutorial-highlight" : ""
          }
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
            boxShadow: isLoading
              ? "none"
              : "0 8px 32px rgba(108, 99, 255, 0.15)",
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
              fontSize: "15px",
              fontFamily: "Inter, sans-serif",
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            style={{
              background:
                isLoading || !inputText.trim()
                  ? "var(--border)"
                  : "var(--primary)",
              border: "none",
              borderRadius: "16px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor:
                isLoading || !inputText.trim() ? "not-allowed" : "pointer",
              color:
                isLoading || !inputText.trim()
                  ? "var(--text-disabled)"
                  : "#fff",
              transition: "transform 0.1s ease, background 0.2s ease",
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
                e.currentTarget.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              if (!isLoading && inputText.trim())
                e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <BsArrowUpCircleFill size={20} />
          </button>
        </div>
        <div
          style={{
            marginTop: "12px",
            fontSize: "11px",
            color: "var(--text-disabled)",
            textAlign: "center",
          }}
        >
          MindMirror AI can make mistakes. Verify important information.
        </div>
      </div>
    </div>
  );
}
