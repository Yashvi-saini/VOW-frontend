import { io } from "socket.io-client";
import { SOCKET_URL } from "../../config.js";

const socket = io(SOCKET_URL, {
  transports: ["polling","websocket"],
  upgrade: false,
  withCredentials: true,
  autoConnect: false,
});
socket.on("connect", () => {
  const t = socket.io.engine.transport?.name;
  console.log("[socket] connected:", socket.id, "transport=", t);
});
socket.on("connect_error", (err) => {
  console.error("[socket] connect_error:", err?.message || err);
});

export default socket;