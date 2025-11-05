// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", credentials: true },
});

io.on("connection", (socket) => {
  console.log("A new user has connected", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Send message to a room
 socket.on("message", (message) => {
  io.to(message.channelId).emit("message", message);
 });

  socket.on("disconnect", () => {
    console.log(socket.id, "disconnected");
  });
  socket.on("leaveRoom", (roomId) => {
  socket.leave(roomId);
  console.log(`User ${socket.id} left room ${roomId}`);
});
});

server.listen(8001, () => {
  console.log("Server is running on port 8001");
});

