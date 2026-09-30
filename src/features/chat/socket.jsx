import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  path: "/socket.io",
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false,
  timeout: 20000,
});
export const connectSocket = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    socket.auth = { token };
  }
  if (!socket.connected) {
    socket.connect();
  }
};
if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
  connectSocket();
}
export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};
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