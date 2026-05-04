import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setUserData } from "../shared/store/userSlice.js"
import { getCurrentUserAPI } from "../shared/api/api.js"
import ChatPage from "./pages/Chatpage.jsx"

export default function App() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.userData)
  const [checking, setChecking] = useState(true)
  const [invalid, setInvalid] = useState(false)

  const checkCurrentUser = async () => {
    try {
      const result = await chrome.storage.local.get("token")
      if (!result.token) {
        setInvalid(true)
        return
      }

      const response = await getCurrentUserAPI(result.token)
      dispatch(setUserData(response.user))

    } catch (error) {
      console.log(`User not authenticated: ${error}`)
      await chrome.storage.local.remove("token")
      setInvalid(true)
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    checkCurrentUser()
  }, [])

  // Auto-close tab after showing invalid message
  useEffect(() => {
    if (!invalid) return
    const timer = setTimeout(async () => {
      const tab = await chrome.tabs.getCurrent()
      chrome.tabs.remove(tab.id)
    }, 3000)
    return () => clearTimeout(timer)
  }, [invalid])

  // Loading state — show nothing while checking
  if (checking) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "var(--bg-primary)"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "32px",
            height: "32px",
            border: "2px solid var(--border)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 12px"
          }} />
          <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
            Loading MindMirror...
          </p>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  // Invalid / unauthenticated state
  if (invalid) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "var(--bg-primary)"
        }}
      >
        <div style={{
          textAlign: "center",
          padding: "32px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          maxWidth: "360px"
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#FF6B6B22",
            border: "1px solid #FF6B6B44",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "22px"
          }}>
            ⚠️
          </div>
          <p style={{
            color: "var(--text-primary)",
            fontSize: "15px",
            fontWeight: 600,
            marginBottom: "8px"
          }}>
            Session Not Valid
          </p>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "12px",
            lineHeight: "1.6"
          }}>
            Please open MindMirror from the extension icon and sign in again.
          </p>
          <p style={{
            color: "var(--text-disabled)",
            fontSize: "11px",
            marginTop: "16px"
          }}>
            This tab will close automatically...
          </p>
        </div>
      </div>
    )
  }

  return <ChatPage />
}