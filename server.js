import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // local dev
      "https://vow-blush.vercel.app" // deployed frontend
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔵 User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`✅ ${socket.id} joined room ${roomId}`);
    io.to(roomId).emit("user-joined", { userId: socket.id });
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`🚪 ${socket.id} left room ${roomId}`);
    io.to(roomId).emit("user-left", { userId: socket.id });
  });

  socket.on("message", (message) => {
    console.log(`💬 Message in room ${message.channelId}: ${message.content}`);
    io.to(message.channelId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 ${socket.id} disconnected`);
    io.emit("user-disconnected", { userId: socket.id });
  });
});

server.listen(process.env.PORT || 8001, () => {
  console.log("🚀 Chat server running");
});