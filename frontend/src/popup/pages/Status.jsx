import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TrackingBadge from "../components/status/TrackingBadge";
import StatsGrid from "../components/status/StatsGrid";
import TipRotator from "../components/status/TipRotator";
import OpenChatButton from "../components/status/OpenChatButton";

export default function Status() {
  const [ignoredCount, setIgnoredCount] = useState(0);
  const [queuedCount, setQueuedCount] = useState(0);

  useEffect(() => {
    chrome.storage.local
      .get(["ignoredPatterns", "sessionQueue"])
      .then((result) => {
        setIgnoredCount((result.ignoredPatterns || []).length);
        setQueuedCount((result.sessionQueue || []).length);
      });
  }, []);

  const handleOpenChat = async () => {
    const tabs = await chrome.tabs.query({
      url: chrome.runtime.getURL("newtab.html"),
    });
    if (tabs.length > 0) {
      await chrome.tabs.update(tabs[0].id, { active: true });
      await chrome.windows.update(tabs[0].windowId, { focused: true });
    } else {
      await chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") });
    }
    window.close();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // ← outer container fills viewport
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <Navbar />

      <div
        style={{
          flex: 1, // ← now has a parent to stretch against
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "14px 16px 16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <TrackingBadge />
          <StatsGrid queuedCount={queuedCount} ignoredCount={ignoredCount} />
          <div style={{ height: "1px", background: "var(--border)" }} />
          <TipRotator />
          <OpenChatButton onClick={handleOpenChat} />
        </div>

        <p
          style={{
            fontSize: "11px",
            color: "var(--text-disabled)",
            textAlign: "center",
            lineHeight: "1.7",
            margin: 0,
          }}
        >
          Built for your memory, not our metrics.
          <br />
          Everything stays between you and your browser.
        </p>
      </div>

      <style>{`
      @keyframes ping {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.8); opacity: 0; }
      }
    `}</style>
    </div>
  );
}
