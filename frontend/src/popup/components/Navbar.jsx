import { useState, useRef, useEffect } from "react"
import { RiLogoutBoxLine } from "react-icons/ri"
import { useSelector, useDispatch } from "react-redux"
import { clearUserData } from "../../shared/store/userSlice"

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const user = useSelector(state => state.user.userData)
  const dispatch = useDispatch()

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getInitial = (name) => {
    if (!name) return "?"
    return name.charAt(0).toUpperCase()
  }

  const handleLogout = async () => {
    await chrome.storage.local.remove("token")
    await chrome.storage.session.remove("currentSession")
    await chrome.storage.local.remove("sessionQueue")
    dispatch(clearUserData())
    setDropdownOpen(false)
  }

  return (
    <nav
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border)"
      }}
    >
      {/* Left — Logo */}
      <div className="flex items-center gap-2">
        <img src="/icons/icon.png" alt="MindMirror" className="w-5 h-5" />
        <span
          className="font-bold text-base tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          MindMirror
        </span>
      </div>

      {/* Right — Auth State */}
      {user ? (
        <div className="relative" ref={dropdownRef}>

          {/* Avatar Circle */}
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="w-8 h-8 rounded-full flex items-center justify-center
                       font-semibold text-sm transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--text-primary)"
            }}
          >
            {getInitial(user.userName)}
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-lg border z-50"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
              }}
            >
              {/* User Info */}
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <p
                  className="font-semibold text-sm truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.userName}
                </p>
                <p
                  className="text-xs truncate mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user.email}
                </p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3
                           text-sm transition-colors hover:opacity-80"
                style={{ color: "var(--accent-secondary)" }}
              >
                <RiLogoutBoxLine size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  )
}