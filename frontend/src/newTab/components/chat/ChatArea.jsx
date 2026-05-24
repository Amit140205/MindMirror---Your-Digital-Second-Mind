import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, setMessages } from "../../../shared/store/chatSlice.js";
import { chatAPI, checkFastapiHealth } from "../../../shared/api/api.js";
import toast from "react-hot-toast";
import Messages from "./Messages.jsx";
import ChatInput from "./ChatInput.jsx";

export default function ChatArea() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);

  // Load persisted messages + check health on mount
  useEffect(() => {
    const init = async () => {
      try {
        const result = await chrome.storage.session.get("chatMessages");
        if (result.chatMessages && result.chatMessages.length > 0) {
          dispatch(setMessages(result.chatMessages));
        }
      } catch (error) {
        console.error("MindMirror: failed to load chat history", error);
      }

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

  const handleSend = async (textOverride = null) => {
    const textToSend =
      typeof textOverride === "string" ? textOverride : inputText.trim();
    if (!textToSend || isLoading) return;

    dispatch(addMessage({ role: "user", text: textToSend }));
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

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const patternResult = await chrome.storage.local.get("ignoredPatterns")
      const ignoredPatterns = patternResult.ignoredPatterns || []

      const response = await chatAPI(token, textToSend, timeZone, ignoredPatterns)

      dispatch(addMessage({ role: "ai", data: response }));
    } catch (error) {
      console.error("Chat API Error:", error);
      toast.error("Failed to fetch response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showMessages = messages.length > 0 || isLoading;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-primary)",
        overflow: "hidden",
      }}
    >
      {/* Scrollable message area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: showMessages ? "flex-start" : "center",
          padding: "24px 24px 8px 24px",
        }}
      >
        {!showMessages ? (
          /* Empty state */
          <div style={{ textAlign: "center" }}>
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
          <Messages
            messages={messages}
            isLoading={isLoading}
            onFollowUp={handleSend}
          />
        )}
      </div>

      {/* API offline warning */}
      {!apiOnline && (
        <div
          style={{
            margin: "0 24px 8px",
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

      {/* Input */}
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
}
