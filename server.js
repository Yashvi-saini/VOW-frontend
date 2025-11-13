// import express from "express";
// import http from "http";
// import { Server } from "socket.io";

// const app = express();
// const server = http.createServer(app);
// app.use(express.json());

// // Allow custom origins via env, fallback to defaults
// const allowedOrigins = (process.env.SOCKET_ORIGINS || "")
//   .split(",")
//   .map(o => o.trim())
//   .filter(Boolean);
// if (!allowedOrigins.length) {
//   allowedOrigins.push("http://localhost:5173");
//   // Add production domain placeholder; replace with real domain e.g. https://vow-org.me
//   allowedOrigins.push("https://vow-org.me");
// }

// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     credentials: true,
//   },
// });

// console.log("⚙️ Socket.IO CORS origins:", allowedOrigins);

// // In-memory presence for map per workspace
// // workspaces: Map<workspaceId, Map<userId, { userId, name, x, y }>>
// const workspaces = new Map();

// io.on("connection", (socket) => {
//   console.log("🔵 User connected:", socket.id, {
//     transport: socket.conn.transport.name,
//     ua: socket.handshake.headers["user-agent"],
//     origin: socket.handshake.headers.origin,
//   });

//   // Track which workspace/user pairs this socket represents
//   socket.data.memberships = new Set(); // entries like `${workspaceId}::${userId}`

//   // ========== Chat events (existing) ==========
//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//     console.log(`✅ ${socket.id} joined room ${roomId}`);
//     io.to(roomId).emit("user-joined", { userId: socket.id });
//   });

//   socket.on("leaveRoom", (roomId) => {
//     socket.leave(roomId);
//     console.log(`🚪 ${socket.id} left room ${roomId}`);
//     io.to(roomId).emit("user-left", { userId: socket.id });
//   });

//   socket.on("message", (message) => {
//     console.log(`💬 Message in room ${message.channelId}: ${message.content}`);
//     io.to(message.channelId).emit("message", message);
//   });

//   // ========== Map presence events ==========
//   socket.on("map:join", ({ workspaceId, userId, name, x, y }) => {
//     if (!workspaceId || !userId) return;
//     const room = `map:${workspaceId}`;
//     socket.join(room);

//     if (!workspaces.has(workspaceId)) workspaces.set(workspaceId, new Map());
//     const members = workspaces.get(workspaceId);
//     const avatar = { userId, name: name || "User", x: Number(x) || 0, y: Number(y) || 0 };
//     members.set(userId, avatar);
//     socket.data.memberships.add(`${workspaceId}::${userId}`);

//   console.log(`🗺️  map:join ${workspaceId} <- ${userId} (${socket.id}) at`, { x: avatar.x, y: avatar.y, total: members.size, members: Array.from(members.keys()) });

//     // Ack to the joining client
//     socket.emit("map:join:ack", { ok: true, userId, workspaceId });

//     // Send current state to the joiner
//   const snapshot = Array.from(members.values());
//   console.log(`📤 map:state to joiner ${userId} size=${snapshot.length}`);
//   socket.emit("map:state", { avatars: snapshot });

//     // Notify others in the room
//     socket.to(room).emit("map:joined", avatar);

//     // Also broadcast a fresh snapshot to everyone for robustness
//     console.log(`📣 broadcast map:state room=${room} size=${snapshot.length}`);
//     io.to(room).emit("map:state", { avatars: snapshot });
//   });

//   socket.on("map:state:request", ({ workspaceId }) => {
//     const members = workspaces.get(workspaceId) || new Map();
//     console.log(`📦 map:state:request for ${workspaceId} by ${socket.id} -> ${members.size} avatars`, Array.from(members.keys()));
//     socket.emit("map:state", { avatars: Array.from(members.values()) });
//   });

//   socket.on("map:update", ({ workspaceId, userId, x, y }) => {
//     if (!workspaceId || !userId) return;
//     const members = workspaces.get(workspaceId);
//     if (!members) return;
//     const avatar = members.get(userId);
//     if (!avatar) return;
//     avatar.x = Number(x) || 0;
//     avatar.y = Number(y) || 0;
//     io.to(`map:${workspaceId}`).emit("map:updated", { userId, x: avatar.x, y: avatar.y });
//     if (Math.random() < 0.02) {
//       console.log(`↻ map:update broadcast sample ${workspaceId} user=${userId} x=${avatar.x} y=${avatar.y}`);
//     }
//   });

//   socket.on("map:leave", ({ workspaceId, userId }) => {
//     if (!workspaceId || !userId) return;
//     const members = workspaces.get(workspaceId);
//     if (members && members.has(userId)) {
//       members.delete(userId);
//       console.log(`👋 map:leave ${workspaceId} <- ${userId} remaining=${members.size}`);
//       const room = `map:${workspaceId}`;
//       io.to(room).emit("map:left", { userId });
//       // Broadcast updated snapshot after removal
//       io.to(room).emit("map:state", { avatars: Array.from(members.values()) });
//       if (members.size === 0) workspaces.delete(workspaceId);
//     }
//     socket.leave(`map:${workspaceId}`);
//     socket.data.memberships.delete(`${workspaceId}::${userId}`);
//   });

//   // Diagnostics
//   socket.conn.on("packet", (packet) => {
//     if (packet.type === "ping") return;
//     if (packet.type === "pong") return;
//     // Uncomment to trace packets: console.debug("📦 packet", packet.type, packet.data?.[0]);
//   });
//   socket.conn.on("close", (reason) => {
//     console.warn("🔻 transport closed:", reason);
//   });
//   socket.conn.on("error", (err) => {
//     console.error("⛔ transport error:", err?.message || err);
//   });

//   // Cleanup on disconnect
//   socket.on("disconnect", (reason) => {
//     console.log(`🔴 ${socket.id} disconnected:`, reason);
//     // Remove all memberships associated with this socket
//     for (const key of socket.data.memberships) {
//       const [workspaceId, userId] = key.split("::");
//       const members = workspaces.get(workspaceId);
//       if (members && members.has(userId)) {
//         members.delete(userId);
//         io.to(`map:${workspaceId}`).emit("map:left", { userId });
//         if (members.size === 0) workspaces.delete(workspaceId);
//       }
//     }
//   });
// });

// // Debug REST endpoint to inspect presence state
// app.get("/debug/workspaces", (req, res) => {
//   const summary = {};
//   for (const [wid, members] of workspaces.entries()) {
//     summary[wid] = Array.from(members.values());
//   }
//   res.json({ workspaces: summary, socketCount: io.engine.clientsCount });
// });

// // Periodic snapshot logging (every 15s)
// setInterval(() => {
//   const counts = Array.from(workspaces.entries()).map(([wid, members]) => `${wid}:${members.size}`);
//   console.log("🕒 presence snapshot", counts.join(" | ") || "(none)");
// }, 15000);

// // Optional stub for /maps to prevent 404 noise during development
// app.post('/maps', (req, res) => {
//   console.log('[maps] received payload', req.body);
//   res.json({ ok: true, received: true });
// });

// const PORT = process.env.PORT || 8001;
// server.listen(PORT, () => {
//   console.log(`🚀 Realtime server running on port ${PORT}`);
// });