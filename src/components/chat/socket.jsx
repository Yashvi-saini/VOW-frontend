import { io } from "socket.io-client";

const DEFAULT_PORT = import.meta.env.VITE_SOCKET_PORT || 8001;
const ENV_URL = import.meta.env.VITE_SOCKET_URL;
const FALLBACK_HOST = typeof window !== "undefined" ? window.location.hostname : "localhost";

// Detect protocol (https → wss, http → ws)
const protocol = typeof window !== "undefined" && window.location.protocol === "https:"
  ? "wss"
  : "ws";

export const SOCKET_URL = ENV_URL || `${protocol}://${FALLBACK_HOST}:${DEFAULT_PORT}`;

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