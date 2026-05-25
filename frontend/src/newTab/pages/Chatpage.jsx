import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatArea from "../components/chat/ChatArea.jsx";
import AnalyticsPage from "./AnalyticsPage.jsx";
import { Toaster } from "react-hot-toast";
import SettingsPage from "./SettingsPage.jsx";
import TutorialModal from "../components/TutorialModal.jsx";

export default function ChatPage({ initialView = "chat" }) {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [tutorialSlide, setTutorialSlide] = useState(0);
  const [activeView, setActiveView] = useState(initialView); 

  const handleOpenTutorial = () => {
    setTutorialSlide(0);
    setIsTutorialOpen(true);
  };

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const result = await chrome.storage.local.get("hasSeenTutorial");
        if (!result.hasSeenTutorial) {
          setIsTutorialOpen(true);
          await chrome.storage.local.set({ hasSeenTutorial: true });
        }
      } catch (error) {
        console.error("Error checking tutorial state:", error);
      }
    };
    checkFirstVisit();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "var(--bg-primary)",
        overflow: "hidden",
      }}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          },
        }}
      />

      <Navbar onTutorialOpen={handleOpenTutorial} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        {/* Render active view — chat stays mounted to preserve messages */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: activeView === "chat" ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <ChatArea />
        </div>

        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: activeView === "analytics" ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <AnalyticsPage isVisible={activeView === "analytics"} />
        </div>

        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: activeView === "settings" ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <SettingsPage/>
        </div>
      </div>

      <TutorialModal
        isOpen={isTutorialOpen}
        currentSlide={tutorialSlide}
        onSlideChange={setTutorialSlide}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
