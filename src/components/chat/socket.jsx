import { io } from "socket.io-client";

// Point to the server port where server.js listens
const SOCKET_URL = "http://localhost:5001";

const socket = io(SOCKET_URL, {
  autoConnect: true,
});

export default socket;