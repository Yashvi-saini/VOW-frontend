import { io } from "socket.io-client";

// Ensure this matches server.js port
const SOCKET_URL = "http://localhost:8001";

const socket = io(SOCKET_URL, {
  autoConnect: true,
});

export default socket;