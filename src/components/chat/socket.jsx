import { io } from "socket.io-client";

// Resolve Socket URL for cross-device usage:
// 1) Use VITE_SOCKET_URL if provided (recommended for LAN/IP hosting)
// 2) Fallback to current host with port (e.g., http://<host>:8001)
const DEFAULT_PORT = import.meta.env.VITE_SOCKET_PORT || 8001;
const ENV_URL = import.meta.env.VITE_SOCKET_URL;
const FALLBACK_HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const SOCKET_URL = ENV_URL || `http://${FALLBACK_HOST}:${DEFAULT_PORT}`;

const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("[socket] connected:", socket.id);
});
socket.on("connect_error", (err) => {
  console.error("[socket] connect_error:", err?.message || err);
});
socket.on("reconnect", (attempt) => {
  console.log("[socket] reconnected after attempts:", attempt, "id:", socket.id);
});
socket.on("disconnect", (reason) => {
  console.warn("[socket] disconnected:", reason);
});

export default socket;