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

export default socket;
