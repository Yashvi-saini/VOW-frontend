import axios from "axios";

let rawApiUrl = import.meta.env.VITE_API_URL || "";

if (rawApiUrl && !rawApiUrl.startsWith("http://") && !rawApiUrl.startsWith("https://")) {
  rawApiUrl = `https://${rawApiUrl}`;
}

const api = axios.create({
  baseURL: rawApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;