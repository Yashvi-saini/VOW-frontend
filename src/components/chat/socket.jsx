import { io } from "socket.io-client";

const DEFAULT_PORT = import.meta.env.VITE_SOCKET_PORT || 8001;
const ENV_URL = import.meta.env.VITE_SOCKET_URL; // e.g. https://socket.yourdomain.com or wss://...
const ENV_PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";
const isBrowser = typeof window !== "undefined";
const pageProtocol = isBrowser ? window.location.protocol : "http:";
const pageOrigin = isBrowser ? window.location.origin : `http://localhost:${DEFAULT_PORT}`;
const hostname = isBrowser ? window.location.hostname : "localhost";
const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

// Prefer explicit URL from env. If absent:
// - In localhost dev, default to ws://localhost:8001 (or VITE_SOCKET_PORT)
// - Otherwise, derive from current page origin (http->ws, https->wss)
export const SOCKET_URL = ENV_URL
  || (isLocalhost
    ? `ws://localhost:${DEFAULT_PORT}`
    : (pageProtocol === "https:" ? pageOrigin.replace(/^https/, "wss") : pageOrigin.replace(/^http/, "ws"))
  );

const socket = io(SOCKET_URL, {
  autoConnect: true,
  path: ENV_PATH,
  withCredentials: true,
  // Allow polling fallback for proxies/CDNs that block native WS
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  reconnectionDelayMax: 5000,
  timeout: 10000,
});

socket.on("connect", () => {
  console.log("[socket] connected:", socket.id);
});
socket.on("connect_error", (err) => {
  console.error("[socket] connect_error:", err?.message || err, {
    url: SOCKET_URL,
    path: ENV_PATH,
  });
});
socket.on("reconnect", (attempt) => {
  console.log("[socket] reconnected after attempts:", attempt, "id:", socket.id);
});
socket.on("disconnect", (reason) => {
  console.warn("[socket] disconnected:", reason);
});

export default socket;