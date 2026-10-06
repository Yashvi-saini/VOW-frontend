import React, { useState, useEffect, useRef, useCallback } from "react";
import Avatar from "./map assets/avtar";
import playerImg from "./map assets/avatar1.jpg";

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
import MiniMap from "./map-components/MiniMap.jsx";
import TeleportPanel from "./map-components/TeleportPanel.jsx";

import { useDispatch, useSelector } from "react-redux";
import {
  setIdentity,
  replaceAvatars,
  upsertAvatar,
  updateAvatarPosition,
  removeAvatar,
  clearAvatars,
} from "./presenceSlice";

import mapSocket, {
  connectMapSocket,
  joinMapPresence,
  leaveMapPresence,
  requestMapSync,
  updateMapPosition,
  setupMapListeners,
  removeMapListeners,
  getMapSocketStatus,
} from "./mapSocket.jsx";

import AvatarsLayer from "./AvatarsLayer.jsx";

const Map = ({ onAvatarCollision }) => {
  const dispatch = useDispatch();
  const userState = useSelector((s) => s.user || {});
  const workspaceId = userState.workspaceId;
  const username =
    userState.fullName ||
    userState.username ||
    userState.profile?.fullName ||
    userState.profile?.username ||
    "User";
  const avatar = userState.avatar || userState.profile?.avatar;
  const { selfId } = useSelector((s) => s.presence || {});
  const userPanningRef = useRef(false);
  const [position, setPosition] = useState({ x: 60, y: 60 });
  const [clickMarker, setClickMarker] = useState(null);
  const [cursorBlocked, setCursorBlocked] = useState(false);
  const [showTeleport, setShowTeleport] = useState(false);
  const positionRef = useRef({ x: 60, y: 60 });
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const obstaclesRef = useRef([]);

  const containerRef = useRef(null);
  const viewportRef = useRef(null);

  const cameraPosRef = useRef({ left: 0, top: 0 });
  const cameraTargetRef = useRef({ left: 0, top: 0 });
  const followCameraRef = useRef(true);
  const keysPressed = useRef({});
  const moveToTargetRef = useRef(null);
  const avatarSize = 65;
  const handleObstaclesFromChild = useCallback((id, newObs) => {
    obstaclesRef.current = Object.values({
      ...obstaclesRef.current,
      [id]: newObs,
    }).flat();
  }, []);
  const isColliding = createCollisionChecker({
    containerRef,
    obstaclesRef,
    avatarSize,
    COLLISION_EPS: 0,
  });

  const findNearestFreePoint = findNearestFreePointFactory(isColliding);
  useMovementKeys({ keysPressedRef: keysPressed, followCameraRef });
  useCameraPanning({
    viewportRef,
    followCameraRef,
    cameraPosRef,
    cameraTargetRef,
    userPanningRef,
  });

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
    avatarConfig: {
      accel: 0.03,
      maxSpeed: 0.5,
      friction: 0.12,
      DEADZONE_RATIO: 0.3,
      CAMERA_SMOOTH: 0.18,
    },
    isColliding,
  });

  const handleMapClick = useClickToMove({
    containerRef,
    isColliding,
    findNearestFreePoint,
    setClickMarker,
    moveToTargetRef,
    followCameraRef,
  });

  const handlePointerMove = (e) =>
    updateCursorBlocked({
      clientX: e.clientX,
      clientY: e.clientY,
      containerRef,
      isColliding,
      setCursorBlocked,
    });
  const currentUserId = userState.userId || userState.profile?._id || userState.profile?.id;
  const selfIdRef = useRef(currentUserId);

  useEffect(() => {
    if (currentUserId) {
      selfIdRef.current = String(currentUserId);
      dispatch(setIdentity({ selfId: String(currentUserId), workspaceId }));
    }
  }, [currentUserId, workspaceId, dispatch]);

useEffect(() => {
  console.log("🌍 MAP MOUNT — Initializing socket & presence");

  let cleanedUp = false;

  connectMapSocket();

  const onConnected = () => {
    if (cleanedUp) return;

    joinMapPresence({
      workspaceId,
      name: username || "Anonymous",
      avatar,
      x: positionRef.current.x,
      y: positionRef.current.y,
    });
  };

  if (mapSocket.connected) onConnected();
  // Also re-join after every reconnect, the server forgets us on disconnect
  mapSocket.on("connect", onConnected);

  removeMapListeners();

  setupMapListeners({
    onJoinAck: (data) => {
      if (data?.userId) {
        selfIdRef.current = data.userId;
        dispatch(setIdentity({ selfId: data.userId }));
      }
    },

    onState: (data) => {
      dispatch(replaceAvatars(data?.avatars || []));
    },

    onJoined: (avatar) => {
      if (avatar.userId !== selfIdRef.current) {
        dispatch(upsertAvatar(avatar));
      }
    },

    onUpdated: (data) => {
      if (data.userId !== selfIdRef.current) {
        dispatch(updateAvatarPosition(data));
      }
    },

    onLeft: ({ userId }) => {
      dispatch(removeAvatar(userId));
    },
  });

  return () => {
    cleanedUp = true;
    removeMapListeners();
    mapSocket.off("connect", onConnected);
    if (mapSocket.connected) leaveMapPresence(workspaceId);
    dispatch(clearAvatars());
  };
}, [workspaceId, username, avatar]);
  // Safety net: re-fetch who is on the map in case a realtime event was missed
  useEffect(() => {
    const id = setInterval(() => {
      if (mapSocket.connected) requestMapSync();
    }, 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const lastSent = { x: null, y: null };

    const interval = setInterval(() => {
      const { x, y } = positionRef.current;

      if (!mapSocket.connected) return;

      const dx = lastSent.x == null ? 999 : Math.abs(x - lastSent.x);
      const dy = lastSent.y == null ? 999 : Math.abs(y - lastSent.y);

      if (dx > 0.05 || dy > 0.05) {
        lastSent.x = x;
        lastSent.y = y;
        updateMapPosition({ workspaceId, x, y, displayName: username, avatar });
      }
    }, 60);

    return () => clearInterval(interval);
  }, [workspaceId, username, avatar]);
  const { avatars } = useSelector((s) => s.presence || {});
  const avatarsRef = useRef({});
  avatarsRef.current = avatars || {};

  // Instantly move to a point (percent of the world), landing on free ground
  const teleportTo = useCallback(
    ({ x, y, nearUser = false }) => {
      // Land beside another person rather than on top of them
      const tx = Math.max(0, Math.min(100, nearUser ? x + 3.5 : x));
      const ty = Math.max(0, Math.min(100, y));
      const free = findNearestFreePoint(tx, ty) || (nearUser ? findNearestFreePoint(x - 3.5, y) : null);
      if (!free) return;
      moveToTargetRef.current = null;
      velocityRef.current = { vx: 0, vy: 0 };
      positionRef.current = free;
      setPosition(free);
      setClickMarker(null);
      followCameraRef.current = true;

      // Jump the camera too instead of gliding across the whole office
      const world = containerRef.current;
      const vp = viewportRef.current;
      if (world && vp) {
        const left = Math.max(0, Math.min(world.clientWidth - vp.clientWidth, (free.x / 100) * world.clientWidth - vp.clientWidth / 2));
        const top = Math.max(0, Math.min(world.clientHeight - vp.clientHeight, (free.y / 100) * world.clientHeight - vp.clientHeight / 2));
        cameraPosRef.current = { left, top };
        cameraTargetRef.current = { left, top };
        vp.scrollTo({ left, top, behavior: "auto" });
      }
      // Tell everyone right away
      if (mapSocket.connected) {
        updateMapPosition({ workspaceId, x: free.x, y: free.y, displayName: username, avatar });
      }
      setShowTeleport(false);
    },
    [findNearestFreePoint, workspaceId, username, avatar]
  );

  // Walk to a point picked on the minimap
  const walkTo = useCallback(
    (x, y) => {
      const target = findNearestFreePoint(x, y);
      if (!target) return;
      moveToTargetRef.current = target;
      followCameraRef.current = true;
    },
    [findNearestFreePoint]
  );

  const mountTimeRef = useRef(Date.now());
  const lastCollisionTimeRef = useRef(0);

  useEffect(() => {
    mountTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!positionRef.current || !avatars) return;

    const now = Date.now();
    if (now - mountTimeRef.current < 3000) return;
    if (now - lastCollisionTimeRef.current < 5000) return;

    const px = positionRef.current.x;
    const py = positionRef.current.y;
    const COLLISION_DISTANCE = 3.0; 

    const collidedUser = Object.values(avatars).find((a) => {
      if (!a || !a.userId || String(a.userId) === String(selfIdRef.current)) return false;
      const rx = a.x ?? a.targetX ?? 60;
      const ry = a.y ?? a.targetY ?? 60;
      const dist = Math.hypot(px - rx, py - ry);
      return dist < COLLISION_DISTANCE;
    });

    if (collidedUser) {
      lastCollisionTimeRef.current = now;
      console.log(`[Map] 🤝 Collision with ${collidedUser.displayName} (${collidedUser.userId})! Opening DM...`);
      onAvatarCollision?.(collidedUser.userId, collidedUser.displayName);
    }
  }, [position, avatars, onAvatarCollision]);
  return (
    <div className="relative w-full">
    <MapContainer
      viewportRef={viewportRef}
      containerRef={containerRef}
      cursorBlocked={cursorBlocked}
      handleMapClick={handleMapClick}
      handlePointerMove={handlePointerMove}
      handlePointerLeave={() => setCursorBlocked(false)}
    >
      <MapObjects
        containerRef={containerRef}
        handleObstaclesFromChild={handleObstaclesFromChild}
        onTeleportClick={() => setShowTeleport(true)}
      />

      <Avatar
        userId={currentUserId}
        name={username || "You"}
        image={avatar}
        size={avatarSize}
        style={{
          position: "absolute",
          top: `${position.y}%`,
          left: `${position.x}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      <AvatarsLayer />

      <ClickMarker clickMarker={clickMarker} />
    </MapContainer>

    <MiniMap
      positionRef={positionRef}
      avatarsRef={avatarsRef}
      obstaclesRef={obstaclesRef}
      viewportRef={viewportRef}
      containerRef={containerRef}
      onNavigate={walkTo}
    />

    {!showTeleport && (
      <button
        type="button"
        onClick={() => setShowTeleport(true)}
        className="absolute top-4 right-4 z-30 rounded-lg bg-[#5C0EA4] text-white text-sm px-3 py-1.5 shadow-lg hover:bg-[#450B7B] transition"
      >
        Teleport
      </button>
    )}
    {showTeleport && (
      <TeleportPanel
        avatars={avatars}
        onTeleport={teleportTo}
        onClose={() => setShowTeleport(false)}
      />
    )}
    </div>
  );
};

export default Map;
