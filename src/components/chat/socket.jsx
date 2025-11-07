import { io } from "socket.io-client";

// Use env override if provided, else default to same host on port 8001 (matches server.js)
const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || `http://${window.location.hostname}:8001`;
console.log("[socket] Connecting to:", SOCKET_URL);

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