import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  path: "/socket.io",
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 20000,
});
export const connectSocket = () => {
  let token = localStorage.getItem("accessToken");
  if (token) {
    token = token.replace(/^Bearer\s+/i, "").trim();
    socket.auth = { token };
  }
  if (!socket.connected && !socket.active) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};





socket.on("error", (msg) => {
  console.error("[socket] Server error:", msg);
});

socket.on("unauthorized", (msg) => {
  console.error("[socket] Unauthorized:", msg);
});
export const joinDMWorkspace = (workspaceId) => {
  connectSocket();
  socket.emit("join_workspace", workspaceId);
};

export const sendDirectMessage = (payload) => {
  connectSocket();
  socket.emit("send_dm", payload);
};

export const onReceiveDirectMessage = (callback) => {
  socket.off("receive_dm");
  socket.on("receive_dm", callback);
};

export const offReceiveDirectMessage = () => {
  socket.off("receive_dm");
};
export const onDMDeleted = (callback) => {
  socket.off("dm_deleted");
  socket.on("dm_deleted", callback);
};

export const offDMDeleted = () => {
  socket.off("dm_deleted");
};

export default socket;