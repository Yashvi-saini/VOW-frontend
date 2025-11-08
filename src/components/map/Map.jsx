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
import socket from "../chat/socket.jsx";
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
    console.log("[map] mount: initializing presence");
    // Resolve workspaceId from Redux (fallback to default if absent)
    const resolvedWorkspaceId = workspaceIdFromRedux || "default-workspace";
    workspaceIdRef.current = resolvedWorkspaceId;
    console.log("[map] workspaceId (redux->used):", workspaceIdFromRedux, "->", resolvedWorkspaceId);

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
          }
          tabIdRef.current = tid;
        } catch {
          tabIdRef.current = `tab-${Math.random().toString(36).slice(2)}`;
        }
      }
      // Use socket.id if available; else use tabId
      const candidate = (socket.id && socket.connected) ? socket.id : tabIdRef.current;
      selfIdRef.current = candidate;
      return selfIdRef.current;
    };
    const selfId = ensureSelfId();
    dispatch(setIdentity({ selfId, workspaceId: resolvedWorkspaceId }));
    console.log("[map] identity set:", { selfId, workspaceId: resolvedWorkspaceId, tabId: tabIdRef.current, socketId: socket.id });

    function onState({ avatars }) {
      console.log("[map] map:state received count=", avatars?.length ?? 0, avatars);
      dispatch(replaceAvatars(avatars));
    }
    function onJoined(avatar) {
      console.log("[map] map:joined received:", avatar);
      dispatch(upsertAvatar(avatar));
    }
    function onUpdated({ userId, x, y }) {
      // Avoid log spam; sample
      if (Math.random() < 0.05) {
        console.log("[map] map:updated received:", { userId, x, y });
      }
      dispatch(updateAvatarPosition({ userId, x, y }));
    }
    function onLeft({ userId }) {
      console.log("[map] map:left received user=", userId);
      // reuse replaceAvatars? add a remove action later if needed
      dispatch({ type: 'presence/removeAvatar', payload: userId });
    }

    socket.on("map:state", onState);
    socket.on("map:joined", onJoined);
    socket.on("map:join:ack", (ack) => {
      console.log("[map] join ack:", ack);
    });
    socket.on("map:updated", onUpdated);
    socket.on("map:left", onLeft);

    // Helper to emit join (used on connect and on mount)
    const emitJoin = () => {
      const sid = ensureSelfId();
      const joinPayload = {
        workspaceId: workspaceIdRef.current,
        userId: sid,
        name: username || "You",
        x: positionRef.current.x,
        y: positionRef.current.y,
      };
      console.log("[map] emitting map:join", joinPayload);
      socket.emit("map:join", joinPayload);
      // Ask for full state after a short delay to ensure we didn't miss initial state
      setTimeout(() => {
        console.log("[map] requesting map:state explicitly");
        socket.emit("map:state:request", { workspaceId: workspaceIdRef.current });
      }, 200);
    };

    // If already connected, join immediately; else wait for connect
    if (socket.connected) emitJoin();
    const onConnect = () => {
      console.log("[map] socket connected, joining presence");
      emitJoin();
    };
    const onReconnect = () => {
      console.log("[map] socket reconnected, re-joining presence");
      emitJoin();
    };
    socket.on("connect", onConnect);
    socket.on("reconnect", onReconnect);

    // Leave on unmount
    return () => {
      socket.emit("map:leave", { workspaceId: workspaceIdRef.current, userId: selfIdRef.current });
      socket.off("map:state", onState);
      socket.off("map:joined", onJoined);
      socket.off("map:updated", onUpdated);
      socket.off("map:left", onLeft);
  socket.off("map:join:ack");
      socket.off("connect", onConnect);
      socket.off("reconnect", onReconnect);
    };
  }, [dispatch, username, workspaceIdFromRedux]);

  // Throttle local position updates ~16Hz
  useEffect(() => {
    const lastSentRef = { x: null, y: null };
    const interval = setInterval(() => {
      const selfId = selfIdRef.current;
      if (!selfId) return;
      const workspaceId = workspaceIdRef.current;
      const { x, y } = positionRef.current;
      const dx = lastSentRef.x == null ? 999 : Math.abs(x - lastSentRef.x);
      const dy = lastSentRef.y == null ? 999 : Math.abs(y - lastSentRef.y);
      if (dx > 0.05 || dy > 0.05 || Math.random() < 0.02) {
        console.debug("[map] emitting map:update", { x: x.toFixed(2), y: y.toFixed(2) });
      }
      lastSentRef.x = x; lastSentRef.y = y;
      socket.emit("map:update", { workspaceId, userId: selfId, x, y });
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