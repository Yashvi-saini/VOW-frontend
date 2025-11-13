import { io } from "socket.io-client";
import { SOCKET_URL } from "../../config.js";




// Create a single socket instance
console.log("[socket] connecting to:", SOCKET_URL);
const socket = io(SOCKET_URL, {
   transports: [ "websocket","polling",], // prefer websocket; will fall back if needed
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
  const t = socket.io.engine.transport?.name;
  console.log("[socket] connected:", socket.id, "transport=", t);
});
socket.on("connect_error", (err) => {
  console.error("[socket] connect_error:", err?.message || err);
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