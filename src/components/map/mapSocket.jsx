import { io } from "socket.io-client";
import chatSocket from "../chat/socket.jsx";

// Use the same socket instance as chat (already connected and working)
const mapSocket = chatSocket;

const BACKEND_URL = "https://vow-org.me";

console.log("════════════════════════════════════════════════════════");
console.log("🗺️  MAP SOCKET INITIALIZATION");
console.log("════════════════════════════════════════════════════════");
console.log("📍 Backend URL:", BACKEND_URL);
console.log("⏰ Timestamp:", new Date().toISOString());
console.log("🔌 Using existing chat socket instance");
console.log("📊 Socket state:", {
  connected: mapSocket.connected,
  id: mapSocket.id,
});
console.log("════════════════════════════════════════════════════════");

// ============================================================
// CONNECTION EVENT HANDLERS WITH DETAILED LOGGING
// Note: Using shared socket with chat, so connection events 
// are already handled by chat/socket.jsx
// ============================================================

// Additional map-specific connection logging
if (mapSocket.connected) {
  console.log("✅ Socket already connected with ID:", mapSocket.id);
} else {
  console.log("⏳ Waiting for socket to connect...");
  mapSocket.once("connect", () => {
    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║  ✅ MAP SOCKET READY                                   ║");
    console.log("╚════════════════════════════════════════════════════════╝");
    console.log("🔌 Socket ID:", mapSocket.id);
    console.log("🌐 Transport:", mapSocket.io.engine.transport.name);
    console.log("────────────────────────────────────────────────────────");
  });
}

// ============================================================
// MAP-SPECIFIC EVENT HANDLERS WITH DETAILED LOGGING
// ============================================================

/**
 * Join the map presence for a workspace
 * @param {Object} payload - { workspaceId, userId, name, x, y }
 */
export const joinMapPresence = (payload) => {
  console.log("┌────────────────────────────────────────────────────────┐");
  console.log("│  📤 SENDING: map:join                                  │");
  console.log("└────────────────────────────────────────────────────────┘");
  console.log("📦 Payload:", JSON.stringify(payload, null, 2));
  console.log("🔌 Socket ID:", mapSocket.id);
  console.log("✅ Connected:", mapSocket.connected);
  console.log("────────────────────────────────────────────────────────");
  
  if (!mapSocket.connected) {
    console.warn("⚠️  Socket not connected! Join will be queued.");
  }
  
  mapSocket.emit("map:join", payload);
};

/**
 * Update avatar position
 * @param {Object} payload - { workspaceId, userId, x, y }
 */
export const updateMapPosition = (payload) => {
  // Don't log every position update to avoid spam
  if (Math.random() < 0.01) { // Log ~1% of updates
    console.log("📍 Position update:", {
      userId: payload.userId,
      x: payload.x?.toFixed(2),
      y: payload.y?.toFixed(2)
    });
  }
  mapSocket.emit("map:update", payload);
};

/**
 * Leave map presence
 * @param {Object} payload - { workspaceId, userId }
 */
export const leaveMapPresence = (payload) => {
  console.log("┌────────────────────────────────────────────────────────┐");
  console.log("│  📤 SENDING: map:leave                                 │");
  console.log("└────────────────────────────────────────────────────────┘");
  console.log("📦 Payload:", JSON.stringify(payload, null, 2));
  console.log("────────────────────────────────────────────────────────");
  
  mapSocket.emit("map:leave", payload);
};

/**
 * Request current state
 * @param {Object} payload - { workspaceId }
 */
export const requestMapState = (payload) => {
  console.log("┌────────────────────────────────────────────────────────┐");
  console.log("│  📤 SENDING: map:state:request                         │");
  console.log("└────────────────────────────────────────────────────────┘");
  console.log("📦 Payload:", JSON.stringify(payload, null, 2));
  console.log("────────────────────────────────────────────────────────");
  
  mapSocket.emit("map:state:request", payload);
};

// ============================================================
// INCOMING EVENT LISTENERS
// ============================================================

/**
 * Setup map event listeners
 * @param {Object} callbacks - Object with callback functions
 */
export const setupMapListeners = (callbacks = {}) => {
  console.log("┌────────────────────────────────────────────────────────┐");
  console.log("│  🎧 SETTING UP MAP EVENT LISTENERS                     │");
  console.log("└────────────────────────────────────────────────────────┘");
  console.log("📋 Callbacks registered:", Object.keys(callbacks).join(", "));
  console.log("────────────────────────────────────────────────────────");

  // Map state (full list of avatars)
  mapSocket.on("map:state", (data) => {
    console.log("┌────────────────────────────────────────────────────────┐");
    console.log("│  📥 RECEIVED: map:state                                │");
    console.log("└────────────────────────────────────────────────────────┘");
    console.log("👥 Total avatars:", data.avatars?.length || 0);
    console.log("📦 Data:", JSON.stringify(data, null, 2));
    console.log("────────────────────────────────────────────────────────");
    
    if (callbacks.onState) {
      callbacks.onState(data);
    }
  });

  // User joined
  mapSocket.on("map:joined", (avatar) => {
    console.log("┌────────────────────────────────────────────────────────┐");
    console.log("│  📥 RECEIVED: map:joined                               │");
    console.log("└────────────────────────────────────────────────────────┘");
    console.log("👤 User:", avatar.name);
    console.log("🆔 User ID:", avatar.userId);
    console.log("📍 Position:", `(${avatar.x?.toFixed(2)}, ${avatar.y?.toFixed(2)})`);
    console.log("────────────────────────────────────────────────────────");
    
    if (callbacks.onJoined) {
      callbacks.onJoined(avatar);
    }
  });

  // Join acknowledgment
  mapSocket.on("map:join:ack", (ack) => {
    console.log("┌────────────────────────────────────────────────────────┐");
    console.log("│  📥 RECEIVED: map:join:ack                             |");
    console.log("└────────────────────────────────────────────────────────┘");
    console.log("✅ Join acknowledged");
    console.log("📦 Data:", JSON.stringify(ack, null, 2));
    console.log("────────────────────────────────────────────────────────");
    
    if (callbacks.onJoinAck) {
      callbacks.onJoinAck(ack);
    }
  });

  // Position updated
  mapSocket.on("map:updated", (data) => {
    // Sample logging to avoid spam
    if (Math.random() < 0.01) {
      console.log("📥 Position update received:", {
        userId: data.userId,
        x: data.x?.toFixed(2),
        y: data.y?.toFixed(2)
      });
    }
    
    if (callbacks.onUpdated) {
      callbacks.onUpdated(data);
    }
  });

  // User left
  mapSocket.on("map:left", (data) => {
    console.log("┌────────────────────────────────────────────────────────┐");
    console.log("│  📥 RECEIVED: map:left                                 │");
    console.log("└────────────────────────────────────────────────────────┘");
    console.log("👤 User ID:", data.userId);
    console.log("────────────────────────────────────────────────────────");
    
    if (callbacks.onLeft) {
      callbacks.onLeft(data);
    }
  });
};

/**
 * Remove all map event listeners
 */
export const removeMapListeners = () => {
  console.log("┌────────────────────────────────────────────────────────┐");
  console.log("│  🔇 REMOVING MAP EVENT LISTENERS                       │");
  console.log("└────────────────────────────────────────────────────────┘");
  
  mapSocket.off("map:state");
  mapSocket.off("map:joined");
  mapSocket.off("map:join:ack");
  mapSocket.off("map:updated");
  mapSocket.off("map:left");
  
  console.log("✅ All map listeners removed");
  console.log("────────────────────────────────────────────────────────");
};

/**
 * Get connection status
 */
export const getMapSocketStatus = () => {
  const status = {
    connected: mapSocket.connected,
    disconnected: mapSocket.disconnected,
    id: mapSocket.id,
    transport: mapSocket.io?.engine?.transport?.name || "unknown",
    url: BACKEND_URL,
    timestamp: new Date().toISOString()
  };
  
  console.log("┌────────────────────────────────────────────────────────┐");
  console.log("│  📊 MAP SOCKET STATUS                                  │");
  console.log("└────────────────────────────────────────────────────────┘");
  console.table(status);
  console.log("────────────────────────────────────────────────────────");
  
  return status;
};

/**
 * Manually connect the socket
 */
export const connectMapSocket = () => {
  console.log("🔌 Manually connecting map socket...");
  if (!mapSocket.connected) {
    mapSocket.connect();
  } else {
    console.log("✅ Already connected");
  }
};

/**
 * Manually disconnect the socket
 */
export const disconnectMapSocket = () => {
  console.log("⚠️  Cannot disconnect - using shared socket with chat");
  console.log("💡 Socket is shared between chat and map features");
};

// Export socket instance and URL
export { mapSocket, BACKEND_URL };
export default mapSocket;
