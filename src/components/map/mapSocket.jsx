import { io } from "socket.io-client";

// ✅ use env instead of hardcoded
const BACKEND_URL = import.meta.env.VITE_SOCKET_URL;

// ✅ always use correct key
const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

const mapSocket = io(BACKEND_URL, {
  path: "/socket.io",

  // keep polling if backend requires it
  transports: ["polling"],
  upgrade: false,

  withCredentials: true,
  autoConnect: false,

  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

// --------------------------------------------
// CONNECT (IMPORTANT FIX)
// --------------------------------------------
export const connectMapSocket = () => {
  const token = getAuthToken();

  // set token RIGHT BEFORE connect
  mapSocket.auth = { token };

  if (!mapSocket.connected) {
    mapSocket.connect();
  }
};

export const disconnectMapSocket = () => {
  if (mapSocket.connected) mapSocket.disconnect();
};

// --------------------------------------------
// LOGS
// --------------------------------------------
mapSocket.on("connect", () => {
  console.log("MAP SOCKET CONNECTED:", mapSocket.id);
  console.log("Transport:", mapSocket.io.engine.transport.name);
});

mapSocket.on("connect_error", (err) => {
  console.error("MAP SOCKET connect_error:", err.message);
});

mapSocket.on("disconnect", (reason) => {
  console.warn("MAP SOCKET DISCONNECTED:", reason);
});

// --------------------------------------------
// CLIENT → SERVER
// --------------------------------------------
export const joinMapPresence = ({ name, x, y }) => {
  mapSocket.emit("join", {
    displayName: name || "User",
    x,
    y,
  });
};

export const updateMapPosition = ({ x, y }) => {
  mapSocket.emit("move", { x, y });
};

export const leaveMapPresence = () => {
  mapSocket.emit("leave");
};

// --------------------------------------------
// SERVER → CLIENT
// --------------------------------------------
export const setupMapListeners = (cb = {}) => {
  mapSocket.off("user-joined");
  mapSocket.off("user-moved");
  mapSocket.off("user-left");
  mapSocket.off("join-ack");
  mapSocket.off("presence-sync");

  let identityReceived = false;

  mapSocket.on("join-ack", (data) => {
    identityReceived = true;
    cb.onJoinAck && cb.onJoinAck(data);
  });

  mapSocket.on("presence-sync", (avatars) => {
    if (!identityReceived) return;
    cb.onState && cb.onState({ avatars });
  });

  mapSocket.on("user-joined", (data) => {
    cb.onJoined && cb.onJoined(data);
  });

  mapSocket.on("user-moved", (data) => {
    cb.onUpdated && cb.onUpdated(data);
  });

  mapSocket.on("user-left", (data) => {
    cb.onLeft && cb.onLeft(data);
  });
};

export const removeMapListeners = () => {
  mapSocket.off("user-joined");
  mapSocket.off("user-moved");
  mapSocket.off("user-left");
  mapSocket.off("join-ack");
  mapSocket.off("presence-sync");
};

// --------------------------------------------
export const getMapSocketStatus = () => {
  return {
    connected: mapSocket.connected,
    id: mapSocket.id,
    transport: mapSocket.io.engine.transport.name,
    timestamp: new Date().toISOString(),
  };
};

export { mapSocket };
export default mapSocket;