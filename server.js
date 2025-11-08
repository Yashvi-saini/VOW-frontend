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

  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("user-joined", { userId: socket.id });
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    io.to(roomId).emit("user-left", { userId: socket.id });
  });

  socket.on("message", (message) => {
    io.to(message.channelId).emit("message", message);
  });

  // 🔑 WebRTC signaling
  // Treat `to` as either a socket.id or a room name (e.g., target user's id)
  socket.on("call-user", ({ to, offer, fromUserId }) => {
    io.to(to).emit("incoming-call", { from: socket.id, fromUserId, offer });
  });

  socket.on("answer-call", ({ to, answer, fromUserId }) => {
    io.to(to).emit("call-answered", { from: socket.id, fromUserId, answer });
  });

  socket.on("ice-candidate", ({ to, candidate, fromUserId }) => {
    io.to(to).emit("ice-candidate", { from: socket.id, fromUserId, candidate });
  });

  socket.on("end-call", ({ to, fromUserId }) => {
    io.to(to).emit("call-ended", { from: socket.id, fromUserId });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
    io.emit("user-disconnected", { userId: socket.id });
  });
});

server.listen(8001, () => {
  console.log("Server is running on port 8001");
});

