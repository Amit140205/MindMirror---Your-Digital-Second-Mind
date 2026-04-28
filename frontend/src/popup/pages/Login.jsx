import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { HiOutlineMagnifyingGlass } from "react-icons/hi2"
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth"
import { useDispatch } from "react-redux"
import { auth } from "../../shared/utils/firebase.js"
import { googleAuthAPI } from "../../shared/api/api.js"
import { setUserData } from "../../shared/store/userSlice.js"
import Navbar from "../components/Navbar.jsx"

export default function Login() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError("")

    try {
      
      const googleToken = await new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
          } else {
            resolve(token)
          }
        })
      })

      
      const credential = GoogleAuthProvider.credential(null, googleToken)
      const firebaseResponse = await signInWithCredential(auth, credential)

      const userName = firebaseResponse.user.displayName
      const email = firebaseResponse.user.email

      
      const data = await googleAuthAPI(userName, email)

      await chrome.storage.local.set({ token: data.token })

      dispatch(setUserData(data.user))

    } catch (error) {
      console.log(`Error in google-login-auth: ${error}`)
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px #6C63FF33; }
          50% { transform: scale(1.08); box-shadow: 0 0 40px #6C63FF66; }
        }
        .orb {
          animation: breathe 3s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff33;
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>

      <Navbar />

      {/* Body */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-10 gap-6">

        {/* Hero */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="orb flex items-center justify-center w-16 h-16 rounded-full border"
            style={{
              background: "linear-gradient(135deg, #6C63FF22, #6C63FF44)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderColor: "#6C63FF55",
            }}
          >
            <HiOutlineMagnifyingGlass
              size={30}
              style={{ color: "var(--primary)" }}
            />
          </div>

          <h1
            className="text-xl font-bold tracking-tight mt-2"
            style={{ color: "var(--text-primary)" }}
          >
            Your Digital Second Mind
          </h1>

          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Your browser remembers URLs. We remember everything.
          </p>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px"
          style={{ backgroundColor: "var(--border)" }}
        />

        {/* Google Sign In Button */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3
                       px-4 py-3 rounded-lg border text-sm font-medium
                       transition-all duration-200"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: loading ? "var(--border)" : "var(--border)",
              color: "var(--text-primary)",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? (
              <>
                <div className="spinner" />
                <span
                  className="animate-pulse"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Connecting...
                </span>
              </>
            ) : (
              <>
                <FcGoogle size={18} />
                Continue with Google
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <p
              className="text-xs text-center"
              style={{ color: "var(--accent-secondary)" }}
            >
              {error}
            </p>
          )}
        </div>

        {/* Footer Note */}
        <p
          className="text-xs text-center"
          style={{ color: "var(--text-disabled)" }}
        >
          Your data is encrypted and private.
          <br />
          We never sell your browsing history.
        </p>

      </div>
    </div>
  )
}