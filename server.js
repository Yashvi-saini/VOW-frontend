import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // Allow list covers local dev, primary production domains, and any Vercel preview.
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser or same-origin
      const allowed = [
        'http://localhost:5173',
        'https://vow-blush.vercel.app',
        'https://vow-live.me',
        'https://vow-org.me'
      ];
      const vercelPreview = /\.vercel\.app$/i.test(origin);
      if (allowed.includes(origin) || vercelPreview) {
        return callback(null, true);
      }
      console.warn('[cors] blocked origin', origin);
      return callback(new Error('CORS not allowed for origin: ' + origin));
    },
    credentials: true,
  },
  allowRequest: (req, callback) => {
    // Detailed low-level request logging for polling & upgrade phases
    const url = req.url;
    const origin = req.headers.origin;
    const ua = req.headers['user-agent'];
    console.log('[allowRequest]', { url, origin, ua });
    callback(null, true);
  }
});

// Express middleware to log raw HTTP polling requests hitting /socket.io
app.use((req, res, next) => {
  if (req.path && req.path.startsWith('/socket.io')) {
    console.log('[socket.io][http]', req.method, req.url, 'origin=', req.headers.origin, 'sid=', req.query.sid);
  }
  next();
});

// Engine.IO level diagnostics to trace 400 causes
io.engine.on('connection_error', (err) => {
  console.log('[engine][connection_error]', err.message, err.code, err.context || '');
});
io.engine.on('initial_headers', (headers, req) => {
  console.log('[engine][initial_headers]', req.url);
});
io.engine.on('headers', (headers, req) => {
  console.log('[engine][headers]', req.url);
});
io.engine.on('upgrade', (req) => {
  console.log('[engine][upgrade]', req.url, 'transport=', req._query && req._query.transport);
});
io.engine.on('connection', (rawSocket) => {
  console.log('[engine][connection] id=', rawSocket.id, 'transport=', rawSocket.transport.name);
});

io.on("connection", (socket) => {
  console.log("🔵 User connected:", socket.id, 'transport=', socket.conn.transport.name);

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

  socket.on("disconnect", (reason) => {
    console.log(`🔴 ${socket.id} disconnected`, 'reason=', reason);
    io.emit("user-disconnected", { userId: socket.id });
  });
});

// Health check to verify server is reachable
app.get('/health', (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

const PORT = process.env.PORT || 8001;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[server] Port ${PORT} is already in use. Set PORT to a free port and retry.`);
  } else {
    console.error('[server] Error:', err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});