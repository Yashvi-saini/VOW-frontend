const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
 

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });
});

server.listen(8000, () => console.log("Server running on port 8000"));