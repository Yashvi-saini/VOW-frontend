import axios from "axios";

const api = axios.create({
  baseURL: "https://vow-org.me/auth", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
