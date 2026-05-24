import axios from "axios";

// Node instance
const axiosNodeInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_NODE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// FastAPI instance
const axiosFastapiInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_FASTAPI_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// auth - backend node
export const googleAuthAPI = async (userName, email) => {
  const response = await axiosNodeInstance.post("/api/auth/google-auth", {
    userName,
    email,
  });
  return response.data;
};

export const getCurrentUserAPI = async (token) => {
  const response = await axiosNodeInstance.get("/api/user/current-user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// chat - backend fastapi
export const chatAPI = async (token, message, timeZone, ignoredPatterns = []) => {
  const response = await axiosFastapiInstance.post(
    "/api/user/chat",
    { message, timeZone, ignoredPatterns},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const checkFastapiHealth = async () => {
  const response = await axiosFastapiInstance.get("/health");
  return response.data;
};

// analytics - backend node
export const analyticsAPI = async (token, filter = "month") => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const response = await axiosNodeInstance.get(
    `/api/user/analytics?filter=${filter}&timeZone=${encodeURIComponent(timeZone)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

// delete all sessions - backend node
export const deleteSessionsAPI = async (token) => {
    const response = await axiosNodeInstance.delete("/api/user/sessions", {
        headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
}