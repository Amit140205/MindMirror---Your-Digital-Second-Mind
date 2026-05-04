import { useState, useEffect } from "react"
import ChatNavbar from "../components/ChatNavbar.jsx"
import TutorialModal from "../components/TutorialModal.jsx"
import Sidebar from "../components/Sidebar.jsx"
import ChatArea from "../components/ChatArea.jsx"
import { Toaster } from "react-hot-toast"

export default function ChatPage() {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [tutorialSlide, setTutorialSlide] = useState(0)

  const handleOpenTutorial = () => {
    setTutorialSlide(0)
    setIsTutorialOpen(true)
  }

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const result = await chrome.storage.local.get("hasSeenTutorial")
        if (!result.hasSeenTutorial) {
          setIsTutorialOpen(true)
          await chrome.storage.local.set({ hasSeenTutorial: true })
        }
      } catch (error) {
        console.error("Error checking tutorial state:", error)
      }
    }

    checkFirstVisit()
  }, [])

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "var(--bg-primary)",
      overflow: "hidden",
    }}>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: "var(--bg-elevated)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
        }
      }} />
      {/* Navbar */}
      <ChatNavbar
        onTutorialOpen={handleOpenTutorial}
        isTutorialOpen={isTutorialOpen}
        tutorialSlide={tutorialSlide}
      />

      {/* Main Content Layout (Sidebar + Chat Area) */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        overflow: "hidden"
      }}>
        <Sidebar
          isTutorialOpen={isTutorialOpen}
          tutorialSlide={tutorialSlide}
        />
        <ChatArea
          isTutorialOpen={isTutorialOpen}
          tutorialSlide={tutorialSlide}
        />
      </div>

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        currentSlide={tutorialSlide}
        onSlideChange={setTutorialSlide}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  )
}
