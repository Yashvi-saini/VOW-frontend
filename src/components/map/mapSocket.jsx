// mapSocket.jsx
import { io } from "socket.io-client";

const BACKEND_URL = "https://vow-org.me";

// Read JWT from cookie or localStorage
const getAuthToken = () => {
  return (
    localStorage.getItem("authToken") ||
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]
  );
};

console.log("════════ MAP SOCKET INITIALIZING ════════");
console.log("Backend:", BACKEND_URL);
console.log("Time:", new Date().toISOString());

// Create standalone socket instance for map
const mapSocket = io(BACKEND_URL, {
  path: "/socket.io",
  transports: ["polling"], // server requires polling
  upgrade: false,
  withCredentials: true, // sends HttpOnly JWT cookie
  auth: { token: getAuthToken() }, // optional (cookie already enough)
  autoConnect: false, // connect manually
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

console.log("Map socket instance created");

// --------------------------------------------
// Connection event logging
// --------------------------------------------
mapSocket.on("connect", () => {
  console.log("════════ MAP SOCKET CONNECTED ════════");
  console.log("ID:", mapSocket.id);
  console.log("Transport:", mapSocket.io.engine.transport.name);
});

mapSocket.on("connect_error", (err) => {
  console.error("❌ MAP SOCKET connect_error:", err.message);
});

mapSocket.on("disconnect", (reason) => {
  console.warn("⚠️ MAP SOCKET DISCONNECTED:", reason);
  if (reason === "io server disconnect") {
    mapSocket.connect(); // auto reconnect
  }
});

// --------------------------------------------
// CLIENT → SERVER EMITS
// --------------------------------------------

// JOIN (no userId/workspaceId)
export const joinMapPresence = ({ name, x, y }) => {
  const payload = {
    displayName: name || "User",
    x,
    y,
  };
  console.log("📤 emit join", payload);
  mapSocket.emit("join", payload);
};

// MOVE (no userId/workspaceId)
export const updateMapPosition = ({ x, y }) => {
  mapSocket.emit("move", { x, y });
};

// LEAVE (no payload)
export const leaveMapPresence = () => {
  console.log("📤 emit leave");
  mapSocket.emit("leave");
};

// --------------------------------------------
// SERVER → CLIENT LISTENERS SETUP
// --------------------------------------------
export const setupMapListeners = (cb = {}) => {
  console.log("🎧 Setting up map listeners");

  // Remove possible duplicate listeners
  mapSocket.off("user-joined");
  mapSocket.off("user-moved");
  mapSocket.off("user-left");
  mapSocket.off("join-ack");
  mapSocket.off("presence-sync");

  // JOIN-ACK
  mapSocket.on("join-ack", (data) => {
    console.log("📥 join-ack", data);
    cb.onJoinAck && cb.onJoinAck(data);

    // Load existing users into state
    if (data.existingUsers && cb.onState) {
      cb.onState({ avatars: data.existingUsers });
    }
  });

  // FULL SYNC (server broadcasts)
  mapSocket.on("presence-sync", (avatars) => {
    console.log("📥 presence-sync", avatars);
    cb.onState && cb.onState({ avatars });
  });

  // USER JOINED
  mapSocket.on("user-joined", (data) => {
    console.log("📥 user-joined", data);
    cb.onJoined && cb.onJoined(data);
  });

  // USER MOVED
  mapSocket.on("user-moved", (data) => {
    cb.onUpdated && cb.onUpdated(data);
  });

  // USER LEFT
  mapSocket.on("user-left", (data) => {
    console.log("📥 user-left", data);
    cb.onLeft && cb.onLeft(data);
  });
};

// Remove all listeners
export const removeMapListeners = () => {
  console.log("🔇 Removing map listeners");

  mapSocket.off("user-joined");
  mapSocket.off("user-moved");
  mapSocket.off("user-left");
  mapSocket.off("join-ack");
  mapSocket.off("presence-sync");
};

// Status logging
export const getMapSocketStatus = () => {
  const status = {
    connected: mapSocket.connected,
    id: mapSocket.id,
    transport: mapSocket.io.engine.transport.name,
    timestamp: new Date().toISOString(),
  };
  console.table(status);
  return status;
};

// Manual connect/disconnect helpers
export const connectMapSocket = () => {
  if (!mapSocket.connected) mapSocket.connect();
};
export const disconnectMapSocket = () => {
  if (mapSocket.connected) mapSocket.disconnect();
};

export { mapSocket };
export default mapSocket;
