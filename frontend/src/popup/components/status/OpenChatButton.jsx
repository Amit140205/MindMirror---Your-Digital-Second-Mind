import { BsLightningChargeFill } from "react-icons/bs"
import { HiArrowRight } from "react-icons/hi2"

export default function OpenChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "11px",
        borderRadius: "10px",
        border: "none",
        background: "var(--primary)",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 0 24px var(--primary-glow)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--primary-hover)"}
      onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}
    >
      <BsLightningChargeFill size={13} />
      Open MindMirror chat
      <HiArrowRight size={13} />
    </button>
  )
}