// socket.jsx
import { io } from "socket.io-client";

// Dynamic URL selection with env override and protocol handling
const ENV_URL = import.meta.env.VITE_SOCKET_URL;
const isProd = process.env.NODE_ENV === 'production';
const fallback = isProd ? 'https://vow-org.me' : 'http://localhost:8001';
export const SOCKET_URL = ENV_URL || fallback;
export const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || '/socket.io';

// Enable deep debug logging via ?socketDebug or VITE_SOCKET_DEBUG=true
const DEBUG = (import.meta.env.VITE_SOCKET_DEBUG === 'true') || (typeof window !== 'undefined' && /[?&]socketDebug(=true)?/i.test(window.location.search));

const socket = io(SOCKET_URL, {
  path: SOCKET_PATH,
  transports: ["websocket", "polling"], // allow fallback if websocket blocked
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  reconnectionDelayMax: 5000,
  timeout: 10000,
});

if (DEBUG) {
  console.log('[socket][debug] init', { SOCKET_URL, SOCKET_PATH, ENV_URL, isProd });
  if (typeof window !== 'undefined') {
    window.__socket = socket; // expose for manual inspection
  }
  socket.io.engine.on('connection_error', (err) => {
    console.log('[socket][debug] engine connection_error', err.message, err.code);
  });
  socket.io.engine.on('upgrade', (transport) => {
    console.log('[socket][debug] engine upgraded to', transport.name);
  });
  socket.io.engine.on('ping', () => console.log('[socket][debug] ping'));
  socket.io.engine.on('pong', (latency) => console.log('[socket][debug] pong latency', latency));
  socket.io.engine.on('close', (reason) => console.log('[socket][debug] engine close', reason));
}

socket.on('connect', () => {
  console.log('✅ [socket] connected', { id: socket.id, url: SOCKET_URL, path: SOCKET_PATH, transport: socket.io.engine.transport.name });
});
socket.on('connect_error', (err) => {
  console.error('❌ [socket] connect_error', err.message || err, { code: err.code, description: err.description, url: SOCKET_URL, path: SOCKET_PATH });
});
socket.on('reconnect_attempt', (attempt) => DEBUG && console.log('[socket][debug] reconnect_attempt', attempt));
socket.on('reconnect', (attempt) => console.log('[socket] reconnected after', attempt));
socket.on('reconnect_error', (err) => DEBUG && console.log('[socket][debug] reconnect_error', err.message || err));
socket.on('reconnect_failed', () => console.warn('[socket] reconnect_failed'));
socket.on('disconnect', (reason) => {
  console.warn('⚠️ [socket] disconnected', reason);
});

export default socket;