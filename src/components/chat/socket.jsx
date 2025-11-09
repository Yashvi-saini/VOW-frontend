// socket.jsx
import { io } from "socket.io-client";

// Point to your backend server
// Use localhost in dev, your domain in production
export const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "https://vow-org.me"       // your deployed backend
    : "http://localhost:8001";   // local dev backend

// Create a single socket instance
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // force WebSocket for stability
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("✅ Connected to socket server:", SOCKET_URL, "as", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Disconnected from socket server:", reason);
});

export default socket;