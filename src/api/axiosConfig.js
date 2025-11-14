import axios from "axios";

const api = axios.create({
  baseURL: "https://vow-org.me/", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

export default api;