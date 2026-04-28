import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

export const googleAuthAPI = async (userName, email) => {
    const response = await axiosInstance.post("/api/auth/google-auth", { userName, email })
    return response.data
}

export const getCurrentUserAPI = async (token) => {
    const response = await axiosInstance.get("/api/user/current-user", {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}

export const batchSessionsAPI = async (token, sessions) => {
    const response = await axiosInstance.post("/api/sessions/batch", { sessions }, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}