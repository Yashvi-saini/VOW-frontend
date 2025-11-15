import { io } from "socket.io-client";
import { SOCKET_URL } from "../../config.js";

const socket = io(SOCKET_URL, {
  path: "/socket.io",        
  transports: ["polling"], 
  withCredentials: true,
  upgrade: true,            
  autoConnect: true,
  timeout: 20000,
});

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

// DM Socket Events
export const joinDMWorkspace = (workspaceId) => {
  socket.emit("join_workspace", workspaceId);
  console.log("[DM] joined workspace:", workspaceId);
};

export const sendDirectMessage = (payload) => {
  socket.emit("send_dm", payload);
  console.log("[DM] sent message:", payload);
};

export const onReceiveDirectMessage = (callback) => {
  socket.on("receive_dm", callback);
};

export const offReceiveDirectMessage = () => {
  socket.off("receive_dm");
};

export const sendDMTyping = (receiverId) => {
  socket.emit("dm_typing", receiverId);
};

export const sendDMStopTyping = (receiverId) => {
  socket.emit("dm_stop_typing", receiverId);
};

export const onDMUserTyping = (callback) => {
  socket.on("dm_user_typing", callback);
};

export const onDMUserStopTyping = (callback) => {
  socket.on("dm_user_stop_typing", callback);
};

export const onDMDeleted = (callback) => {
  socket.on("dm_deleted", callback);
};

export const offDMDeleted = () => {
  socket.off("dm_deleted");
};

export default socket;
