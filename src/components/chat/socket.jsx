import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL, {
  path: "/socket.io",
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false, // important
  timeout: 20000,
});

// connect only after token is ready
export const connectSocket = () => {
  const token = localStorage.getItem("accessToken");

  socket.auth = { token };
  socket.connect();
};

// optional disconnect helper
export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

// logs
socket.on("connect", () => {
  const t = socket.io.engine.transport?.name;
  console.log("[socket] connected:", socket.id, "transport=", t);
});

socket.on("connect_error", (err) => {
  console.error("[socket] connect_error:", err?.message || err);
});

socket.on("disconnect", (reason) => {
  console.log("[socket] disconnected:", reason);
});

// DM functions
export const joinDMWorkspace = (workspaceId) => {
  socket.emit("join_workspace", workspaceId);
};

export const sendDirectMessage = (payload) => {
  socket.emit("send_dm", payload);
};

export const onReceiveDirectMessage = (callback) => {
  socket.off("receive_dm");
  socket.on("receive_dm", callback);
};

export const offReceiveDirectMessage = () => {
  socket.off("receive_dm");
};

// DM deleted listener
export const onDMDeleted = (callback) => {
  socket.off("dm_deleted");
  socket.on("dm_deleted", callback);
};

export const offDMDeleted = () => {
  socket.off("dm_deleted");
};

export default socket;