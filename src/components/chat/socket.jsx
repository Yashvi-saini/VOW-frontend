import { io } from "socket.io-client";
import { SOCKET_URL } from "../../config.js";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  
});

socket.on("connect", () => {
  console.log("[socket] connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("[socket] connect_error:", err?.message || err);
});

export default socket;