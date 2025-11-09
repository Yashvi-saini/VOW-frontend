import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // local dev
      "https://your-frontend.vercel.app" // your deployed frontend
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔵 User connected:", socket.id);

  // Join a chat room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`✅ ${socket.id} joined room ${roomId}`);
    io.to(roomId).emit("user-joined", { userId: socket.id });
  });

  // Leave a chat room
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`🚪 ${socket.id} left room ${roomId}`);
    io.to(roomId).emit("user-left", { userId: socket.id });
  });

  // Handle messages
  socket.on("message", (message) => {
    console.log(`💬 Message in room ${message.channelId}: ${message.content}`);
    io.to(message.channelId).emit("message", message);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 ${socket.id} disconnected`);
    io.emit("user-disconnected", { userId: socket.id });
  });
});

server.listen(8001, () => {
  console.log("🚀 Chat server running on port 8001");
});