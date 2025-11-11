// socket.jsx
import { io } from "socket.io-client";

// Point to your backend server
// Use localhost in dev, your domain in production
// Prefer explicit env override (e.g., VITE_SOCKET_URL) else fall back by NODE_ENV
const envSocket = import.meta.env?.VITE_SOCKET_URL || process.env.VITE_SOCKET_URL;
export const SOCKET_URL = envSocket || (
  process.env.NODE_ENV === "production"
    ? "https://vow-org.me"       // deployed backend base URL (replace if different)
    : "http://localhost:8001"    // local dev backend
);

// Create a single socket instance
console.log("[socket] connecting to:", SOCKET_URL);
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // prefer websocket; will fall back if needed
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 8,
  reconnectionDelay: 800,
  timeout: 10000,
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("✅ Connected to socket server:", SOCKET_URL, "as", socket.id);
  console.log("➡️ Transport:", socket.io.engine.transport.name);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Disconnected from socket server:", reason);
});

// Extra diagnostics
socket.io.on("reconnect_attempt", (attempt) => console.log("♻️ reconnect_attempt", attempt));
socket.io.on("reconnect_error", (err) => console.warn("♻️ reconnect_error", err?.message || err));
socket.io.on("reconnect_failed", () => console.error("♻️ reconnect_failed"));
socket.on("connect_error", (err) => {
  console.error("⛔ connect_error:", err?.message || err);
});
socket.on("error", (err) => {
  console.error("⛔ socket error:", err);
});

export default socket;