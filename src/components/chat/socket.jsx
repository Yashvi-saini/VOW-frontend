// socket.jsx
import { io } from "socket.io-client";
import { SOCKET_URL } from "../../config.js";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  
});

// if (DEBUG) {
//   console.log('[socket][debug] init', { SOCKET_URL, SOCKET_PATH, ENV_URL, isProd, FORCE_POLLING });
//   if (typeof window !== 'undefined') {
//     window.__socket = socket; // expose for manual inspection
//   }
//   socket.io.engine.on('connection_error', (err) => {
//     console.log('[socket][debug] engine connection_error', err.message, err.code);
//   });
//   socket.io.engine.on('upgrade', (transport) => {
//     console.log('[socket][debug] engine upgraded to', transport.name);
//   });
//   socket.io.engine.on('ping', () => console.log('[socket][debug] ping'));
//   socket.io.engine.on('pong', (latency) => console.log('[socket][debug] pong latency', latency));
//   socket.io.engine.on('close', (reason) => console.log('[socket][debug] engine close', reason));
// }

socket.on('connect', () => {
  console.log('✅ [socket] connected', { id: socket.id, url: SOCKET_URL, path: SOCKET_PATH, transport: socket.io.engine.transport.name });
});

socket.on("connect_error", (err) => {
  console.error("[socket] connect_error:", err?.message || err);
});

export default socket;