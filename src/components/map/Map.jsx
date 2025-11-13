import React, { useState, useEffect, useRef, useCallback } from "react";
// Modular single-avatar map implementation
import Avatar from "../map/map assets/avtar";
import playerImg from "../map/map assets/avatar1.jpg";
import MapContainer from "./map-components/mapcontainer.jsx";
import MapObjects from "./map-components/mapcollisionobj.jsx";
import ClickMarker from "./map-components/clickmarker.jsx";
import { createCollisionChecker } from "./map-components/collisionlogic.jsx";
import { findNearestFreePointFactory } from "./map-components/findnearestfreepoint.jsx";
import { useMovementKeys } from "./map-components/usemovementkeys.jsx";
import { useCameraPanning } from "./map-components/usecamerapaning.jsx";
import { updateCursorBlocked } from "./map-components/useCursorBlockDetection.js";
import { usePlayerMovementCamera } from "./map-components/usePlayerMovementCamera.jsx";
import { useClickToMove } from "./map-components/useClickToMove.js";
import { useDispatch, useSelector } from "react-redux";
import { setIdentity, replaceAvatars, upsertAvatar, updateAvatarPosition } from "./presenceSlice";
import mapSocket, {
  joinMapPresence,
  updateMapPosition,
  leaveMapPresence,
  requestMapState,
  setupMapListeners,
  removeMapListeners,
  getMapSocketStatus
} from "./mapSocket.jsx";
import AvatarsLayer from "./AvatarsLayer.jsx";

const Map = () => {
  const dispatch = useDispatch();
  const { username, workspaceId: workspaceIdFromRedux } = useSelector(s => s.user || {});
  const selfIdRef = useRef(null);
  const tabIdRef = useRef(null);
  const workspaceIdRef = useRef("default-workspace");
  // Single local avatar state
  const [position, setPosition] = useState({ x: 60, y: 60 });
  const [clickMarker, setClickMarker] = useState(null); // {x, y, valid}
  const [cursorBlocked, setCursorBlocked] = useState(false);
  const [obstacles, setObstacles] = useState([]);

  // Refs
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const positionRef = useRef({ x: 60, y: 60 });
  const obstaclesRef = useRef([]);
  const obstaclesByIdRef = useRef({});
  const keysPressed = useRef({});
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const followCameraRef = useRef(true);
  const userPanningRef = useRef(false);
  const cameraPosRef = useRef({ left: 0, top: 0 });
  const cameraTargetRef = useRef({ left: 0, top: 0 });
  const moveToTargetRef = useRef(null);

  // Config
  const avatarSize = 65;
  const accel = 0.03;
  const maxSpeed = 0.5;
  const friction = 0.12;
  const COLLISION_EPS = 0;
  const DEADZONE_RATIO = 0.3;
  const CAMERA_SMOOTH = 0.18;

  // Clear allowMap flag when mounting (legacy logic)
  useEffect(() => {
    try { sessionStorage.removeItem("allowMap"); } catch (_) {}
  }, []);

  // Aggregate obstacles from children
  const handleObstaclesFromChild = useCallback((id, newObstacles) => {
    obstaclesByIdRef.current = { ...obstaclesByIdRef.current, [id]: newObstacles };
    const merged = Object.values(obstaclesByIdRef.current).flat();
    obstaclesRef.current = merged;
    setObstacles((prev) => (prev === merged ? prev : merged));
  }, []);

  // Collision + nearest free point utilities
  const isColliding = createCollisionChecker({
    containerRef,
    obstaclesRef,
    avatarSize,
    COLLISION_EPS,
  });
  const findNearestFreePoint = findNearestFreePointFactory(isColliding);

  // Keyboard and camera panning hooks
  useMovementKeys({ keysPressedRef: keysPressed, followCameraRef });
  useCameraPanning({ viewportRef, followCameraRef, cameraPosRef, cameraTargetRef, userPanningRef });

  // Initialize camera position once viewport ready
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    cameraPosRef.current = { left: vp.scrollLeft, top: vp.scrollTop };
    cameraTargetRef.current = { left: vp.scrollLeft, top: vp.scrollTop };
  }, []);

  // Movement + camera loop (hook)
  usePlayerMovementCamera({
    positionRef,
    velocityRef,
    setPosition,
    setClickMarker,
    keysPressed,
    moveToTargetRef,
    containerRef,
    viewportRef,
    cameraPosRef,
    cameraTargetRef,
    followCameraRef,
    avatarConfig: { accel, maxSpeed, friction, DEADZONE_RATIO, CAMERA_SMOOTH },
    isColliding,
  });

  // Cursor blocked detection
  const handlePointerMove = (e) => updateCursorBlocked({
    clientX: e.clientX,
    clientY: e.clientY,
    containerRef,
    isColliding,
    setCursorBlocked,
  });
  const handlePointerLeave = () => setCursorBlocked(false);

  // Click-to-move handler (hook)
  const handleMapClick = useClickToMove({
    containerRef,
    isColliding,
    findNearestFreePoint,
    setClickMarker,
    moveToTargetRef,
    followCameraRef,
  });

  // ========== Presence wiring ==========
  // Join presence on mount
  useEffect(() => {
    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║  🗺️  MAP COMPONENT MOUNTING                            ║");
    console.log("╚════════════════════════════════════════════════════════╝");
    console.log("👤 Username:", username);
    console.log("🏢 Workspace ID (from Redux):", workspaceIdFromRedux);
    
    // Check socket status immediately
    console.log("🔌 Socket Status Check:");
    console.log("   - Connected:", mapSocket.connected);
    console.log("   - ID:", mapSocket.id);
    console.log("   - Disconnected:", mapSocket.disconnected);
    
    // Get socket status
    getMapSocketStatus();
    
    // If socket is not connected, wait for it
    if (!mapSocket.connected) {
      console.log("⏳ Socket not ready yet, waiting for connection...");
      
      const connectHandler = () => {
        console.log("✅ Socket connected! ID:", mapSocket.id);
        console.log("🚀 Now initializing map presence...");
        initializePresence();
      };
      
      mapSocket.once("connect", connectHandler);
      
      // Also try to connect if socket exists but is disconnected
      if (mapSocket.disconnected && typeof mapSocket.connect === 'function') {
        console.log("🔄 Attempting to reconnect socket...");
        mapSocket.connect();
      }
      
      return () => {
        mapSocket.off("connect", connectHandler);
      };
    }
    
    // Socket already connected, initialize immediately
    console.log("✅ Socket already connected, initializing presence");
    initializePresence();
    
    function initializePresence() {
      console.log("📋 Initializing map presence...");
      
      // Resolve workspaceId from Redux (fallback to default if absent)
      const resolvedWorkspaceId = workspaceIdFromRedux || "default-workspace";
      workspaceIdRef.current = resolvedWorkspaceId;
      console.log("📋 Resolved Workspace ID:", resolvedWorkspaceId);

    // Ensure we have a stable selfId; prefer socket.id when connected
    const ensureSelfId = () => {
      // Stable per-tab id (sessionStorage) avoids collisions across windows even before socket connects
      if (!tabIdRef.current) {
        try {
          const key = 'mapTabId';
          let tid = sessionStorage.getItem(key);
          if (!tid) {
            tid = (crypto?.randomUUID ? crypto.randomUUID() : `tab-${Math.random().toString(36).slice(2)}`);
            sessionStorage.setItem(key, tid);
            console.log("🆔 Generated new tab ID:", tid);
          } else {
            console.log("🆔 Retrieved existing tab ID:", tid);
          }
          tabIdRef.current = tid;
        } catch (e) {
          console.warn("⚠️  SessionStorage not available, using fallback");
          tabIdRef.current = `tab-${Math.random().toString(36).slice(2)}`;
        }
      }
      // Use socket.id if available; else use tabId
      const candidate = (mapSocket.id && mapSocket.connected) ? mapSocket.id : tabIdRef.current;
      selfIdRef.current = candidate;
      console.log("🆔 Self ID:", selfIdRef.current, "(socket:", mapSocket.id, "tab:", tabIdRef.current, ")");
      return selfIdRef.current;
    };
    
    const selfId = ensureSelfId();
    dispatch(setIdentity({ selfId, workspaceId: resolvedWorkspaceId }));
    console.log("✅ Identity set in Redux");
    console.log("────────────────────────────────────────────────────────");

    // Setup event listeners
    const callbacks = {
      onState: (data) => {
        console.log("[MAP] Dispatching replaceAvatars with", data.avatars?.length || 0, "avatars");
        dispatch(replaceAvatars(data.avatars));
      },
      onJoined: (avatar) => {
        console.log("[MAP] Dispatching upsertAvatar for", avatar.name);
        dispatch(upsertAvatar(avatar));
      },
      onJoinAck: (ack) => {
        console.log("[MAP] Join acknowledged, success:", ack.success);
      },
      onUpdated: ({ userId, x, y }) => {
        // Reduce log spam
        if (Math.random() < 0.02) {
          console.log("[MAP] Position update:", userId, "at", x?.toFixed(2), y?.toFixed(2));
        }
        dispatch(updateAvatarPosition({ userId, x, y }));
      },
      onLeft: ({ userId }) => {
        console.log("[MAP] User left:", userId);
        dispatch({ type: 'presence/removeAvatar', payload: userId });
      }
    };

    setupMapListeners(callbacks);

    // Helper to emit join (used on connect and on mount)
    const emitJoin = () => {
      const sid = ensureSelfId();
      const joinPayload = {
        workspaceId: workspaceIdRef.current,
        userId: sid,
        name: username || "Anonymous",
        x: positionRef.current.x,
        y: positionRef.current.y,
      };
      console.log("[MAP] Emitting join with payload:", joinPayload);
      joinMapPresence(joinPayload);
      
      // Request full state after delay
      setTimeout(() => {
        console.log("[MAP] Requesting full state (delayed)");
        requestMapState({ workspaceId: workspaceIdRef.current });
      }, 800);
    };

    // Emit join now that socket is connected
    console.log("[MAP] Socket is connected, joining immediately");
    emitJoin();
    
    const onReconnect = () => {
      console.log("[MAP] Socket reconnected event - re-joining presence");
      emitJoin();
    };
    
    mapSocket.on("reconnect", onReconnect);

    // Leave on unmount
    return () => {
      console.log("╔════════════════════════════════════════════════════════╗");
      console.log("║  🗺️  MAP COMPONENT UNMOUNTING                          ║");
      console.log("╚════════════════════════════════════════════════════════╝");
      
      leaveMapPresence({ 
        workspaceId: workspaceIdRef.current, 
        userId: selfIdRef.current 
      });
      
      removeMapListeners();
      mapSocket.off("reconnect", onReconnect);
      
      console.log("✅ Cleanup complete");
      console.log("────────────────────────────────────────────────────────");
    };
    }
  }, [dispatch, username, workspaceIdFromRedux]);

  // Throttle local position updates ~16Hz
  useEffect(() => {
    const lastSentRef = { x: null, y: null };
    const interval = setInterval(() => {
      const selfId = selfIdRef.current;
      if (!selfId || !mapSocket.connected) return;
      
      const workspaceId = workspaceIdRef.current;
      const { x, y } = positionRef.current;
      const dx = lastSentRef.x == null ? 999 : Math.abs(x - lastSentRef.x);
      const dy = lastSentRef.y == null ? 999 : Math.abs(y - lastSentRef.y);
      
      if (dx > 0.05 || dy > 0.05 || Math.random() < 0.02) {
        lastSentRef.x = x; 
        lastSentRef.y = y;
        updateMapPosition({ workspaceId, userId: selfId, x, y });
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Expose a safe room collector after map mounts, so callers can query reliably after showing the map
  useEffect(() => {
    const collector = (includeCorridor = true) => {
      const selector = includeCorridor
        ? '[data-room-id]'
        : '[data-room-id]:not(#corridor)';
      return Array.from(document.querySelectorAll(selector))
        .map(n => n.getAttribute('data-room-id'))
        .filter(Boolean);
    };
    try {
      window.getMapRooms = collector;
    } catch (_) {}
    return () => {
      try { delete window.getMapRooms; } catch (_) {}
    };
  }, []);

  return (
    <MapContainer
      viewportRef={viewportRef}
      containerRef={containerRef}
      cursorBlocked={cursorBlocked}
      handleMapClick={handleMapClick}
      handlePointerMove={handlePointerMove}
      handlePointerLeave={handlePointerLeave}
    >
      <MapObjects containerRef={containerRef} handleObstaclesFromChild={handleObstaclesFromChild} />
      <Avatar
        image={playerImg}
        size={avatarSize}
        name="You"
        style={{ position: "absolute", top: `${position.y}%`, left: `${position.x}%`, transform: "translate(-50%, -50%)" }}
      />
      <AvatarsLayer />
      <ClickMarker clickMarker={clickMarker} />
    </MapContainer>
  );
};

export default Map;