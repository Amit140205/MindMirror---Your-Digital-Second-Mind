import axios from "axios"

// Node instance
const axiosNodeInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_NODE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

// FastAPI instance
const axiosFastapiInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_FASTAPI_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

// auth - backend node
export const googleAuthAPI = async (userName, email) => {
    const response = await axiosNodeInstance.post("/api/auth/google-auth", { userName, email })
    return response.data
}

export const getCurrentUserAPI = async (token) => {
    const response = await axiosNodeInstance.get("/api/user/current-user", {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}


// chat - backend fastapi
export const chatAPI = async (token, message, timezone) => {
    const response = await axiosFastapiInstance.post("/api/user/chat",
        { message, timezone },
        { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
}

export const checkFastapiHealth = async () => {
  const response = await axiosFastapiInstance.get("/health")
  return response.data
}