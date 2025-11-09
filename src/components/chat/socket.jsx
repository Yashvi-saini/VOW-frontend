import { io } from "socket.io-client";

// Compute a sensible default URL:
// - Respect VITE_SOCKET_URL when provided (e.g., wss://vow-org.me)
// - On localhost dev, default to ws://localhost:8001 (or VITE_SOCKET_PORT)
// - Otherwise, derive from current page origin (http->ws, https->wss)
const DEFAULT_PORT = import.meta.env.VITE_SOCKET_PORT || 8001;
const ENV_URL = import.meta.env.VITE_SOCKET_URL;
export const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";
const isBrowser = typeof window !== "undefined";
const hostname = isBrowser ? window.location.hostname : "localhost";
const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

function deriveUrl() {
  if (ENV_URL) return ENV_URL;
  if (isLocalhost) return `ws://localhost:${DEFAULT_PORT}`;
  const origin = isBrowser ? window.location.origin : `http://localhost:${DEFAULT_PORT}`;
  return origin.startsWith("https") ? origin.replace(/^https/, "wss") : origin.replace(/^http/, "ws");
}

export const SOCKET_URL = deriveUrl();

// Optional deep debug: enable via VITE_SOCKET_DEBUG=true or add ?socketDebug in URL
const DEBUG = (import.meta.env.VITE_SOCKET_DEBUG === "true") || (isBrowser && /[?&]socketDebug(=true)?/i.test(window.location.search));

console.log("[socket] connecting to", SOCKET_URL, "path=", SOCKET_PATH, "isLocalhost=", isLocalhost);

const socket = io(SOCKET_URL, {
  autoConnect: true,
  path: SOCKET_PATH,
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  reconnectionDelayMax: 5000,
  timeout: 10000,
});

if (DEBUG) {
  console.log("[socket][debug] options", {
    SOCKET_URL,
    SOCKET_PATH,
    DEFAULT_PORT,
    transports: socket.io?.opts?.transports,
  });
  // Observe transport selection/upgrade and pings
  socket.on("transport", (transport) => {
    console.log("[socket][debug] transport selected", transport?.name);
  });
  if (socket.io?.engine) {
    socket.io.engine.on("upgrade", (transport) => {
      console.log("[socket][debug] engine upgraded to", transport.name);
    });
    socket.io.engine.on("ping", () => console.log("[socket][debug] ping"));
    socket.io.engine.on("pong", (latency) => console.log("[socket][debug] pong latency", latency));
    socket.io.engine.on("close", (reason) => console.log("[socket][debug] engine close", reason));
    socket.io.engine.on("error", (err) => console.log("[socket][debug] engine error", err?.message || err));
  }
}

socket.on("connect", () => {
  console.log("[socket] connected:", socket.id);
});
socket.on("connect_error", (err) => {
  console.error("[socket] connect_error:", err?.message || err, {
    url: SOCKET_URL,
    path: SOCKET_PATH,
    code: err?.code,
    description: err?.description,
  });
});
socket.on("reconnect", (attempt) => {
  console.log("[socket] reconnected after attempts:", attempt, "id:", socket.id);
});
socket.on("disconnect", (reason) => {
  console.warn("[socket] disconnected:", reason);
});

export default socket;