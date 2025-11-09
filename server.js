// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // Allow your production and local dev origins. Regex allows any Vercel preview domain as well.
    origin: [
      "https://vow-blush.vercel.app",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      /\.vercel\.app$/
    ],
    credentials: true,
  },
});

// Simple health endpoint to verify server reachability
app.get('/health', (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

// In-memory avatar presence (by workspace). For production consider persistence or TTL cleanup.
const workspacePresence = new Map(); // workspaceId -> Map(userId -> { userId, name, x, y, updatedAt })

// Engine.IO level diagnostics (connection/upgrade/errors)
io.engine.on("connection", (rawSocket) => {
  const origin = rawSocket?.request?.headers?.origin;
  const ip = rawSocket?.request?.socket?.remoteAddress;
  console.log("[engine] connection transport=", rawSocket.transport.name, "origin=", origin, "ip=", ip);
  rawSocket.on("upgrade", () => {
    console.log("[engine] upgraded to", rawSocket.transport.name);
  });
  rawSocket.on("error", (err) => {
    console.log("[engine] error", err?.message || err);
  });
  rawSocket.on("close", (reason) => {
    console.log("[engine] close", reason);
  });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Log any incoming event for deeper diagnostics
  socket.onAny((event, ...args) => {
    try {
      const preview = typeof args[0] === 'object' ? JSON.stringify(args[0]) : String(args[0]);
      console.log(`[onAny] event=${event} from=${socket.id} payload=${preview}`);
    } catch {
      console.log(`[onAny] event=${event} from=${socket.id}`);
    }
  });

  // ============ Existing chat & calling features ============
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

  // ============ Map Presence Protocol ============
  // MAP_JOIN: { workspaceId, userId, name, x, y }
  socket.on("map:join", ({ workspaceId, userId, name, x = 50, y = 50 }) => {
    if (!workspaceId || !userId) return;
    socket.data.workspaceId = workspaceId;
    socket.data.userId = userId;
    // join a room per workspace for scoped broadcasts
    try { socket.join(workspaceId); } catch {}
    let space = workspacePresence.get(workspaceId);
    if (!space) { space = new Map(); workspacePresence.set(workspaceId, space); }
    const avatar = { userId, name: name || userId, x, y, updatedAt: Date.now() };
    space.set(userId, avatar);
    console.log(`[map:join] workspace=${workspaceId} user=${userId} total=${space.size}`);
    // Acknowledge to sender for debugging
    socket.emit("map:join:ack", { workspaceId, userId, total: space.size });
    // Send full state to joining client
    socket.emit("map:state", { avatars: Array.from(space.values()) });
    // Broadcast new join to others
    socket.to(workspaceId).emit("map:joined", avatar);
  });

  // MAP_UPDATE: { workspaceId, userId, x, y }
  socket.on("map:update", ({ workspaceId, userId, x, y }) => {
    if (!workspaceId || !userId || x == null || y == null) return;
    const space = workspacePresence.get(workspaceId);
    if (!space) return;
    const avatar = space.get(userId);
    if (!avatar) return;
    avatar.x = x; avatar.y = y; avatar.updatedAt = Date.now();
    if (Math.random() < 0.05) { // sample logs (5%) to avoid spam
      console.log(`[map:update] workspace=${workspaceId} user=${userId} x=${x.toFixed(2)} y=${y.toFixed(2)}`);
    }
    // Broadcast delta (exclude sender) within workspace
    socket.to(workspaceId).emit("map:updated", { userId, x, y });
  });

  // MAP_STATE REQUEST: client can ask for a fresh full state
  socket.on("map:state:request", ({ workspaceId }) => {
    const space = workspacePresence.get(workspaceId);
    const list = Array.from(space?.values() || []);
    console.log(`[map:state:request] workspace=${workspaceId} count=${list.length}`);
    socket.emit("map:state", { avatars: list });
  });

  // MAP_LEAVE: { workspaceId, userId }
  socket.on("map:leave", ({ workspaceId, userId }) => {
    if (!workspaceId || !userId) return;
    const space = workspacePresence.get(workspaceId);
    if (!space) return;
    space.delete(userId);
    console.log(`[map:leave] workspace=${workspaceId} user=${userId} remaining=${space.size}`);
    socket.to(workspaceId).emit("map:left", { userId });
  });

  // Clean up on disconnect
  socket.on("disconnect", () => {
    const { workspaceId, userId } = socket.data || {};
    if (workspaceId && userId) {
      const space = workspacePresence.get(workspaceId);
      space?.delete(userId);
      try { socket.leave(workspaceId); } catch {}
      console.log(`[disconnect] workspace=${workspaceId} user=${userId} remaining=${space?.size}`);
      socket.to(workspaceId).emit("map:left", { userId });
    }
    console.log(`${socket.id} disconnected`);
    io.emit("user-disconnected", { userId: socket.id });
  });
});

server.listen(8001, () => {
  console.log("Server is running on port 8001");
});

