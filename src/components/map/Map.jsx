import React, { useState, useEffect, useRef, useCallback } from "react";
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
import {
  setIdentity,
  replaceAvatars,
  upsertAvatar,
  updateAvatarPosition,
} from "./presenceSlice";

import mapSocket, {
  connectMapSocket,
  joinMapPresence,
  leaveMapPresence,
  updateMapPosition,
  setupMapListeners,
  removeMapListeners,
  getMapSocketStatus,
} from "./mapSocket.jsx";

import AvatarsLayer from "./AvatarsLayer.jsx";

const Map = () => {
  const dispatch = useDispatch();
  const { username, avatar } = useSelector((s) => s.user || {});
  const { selfId } = useSelector((s) => s.presence || {});
  const userPanningRef = useRef(false);
  // Local avatar state
  const [position, setPosition] = useState({ x: 60, y: 60 });
  const [clickMarker, setClickMarker] = useState(null);
  const [cursorBlocked, setCursorBlocked] = useState(false);

  // Refs
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
const userPanningRef = useRef(false);
  const avatarSize = 65;

  // ----------------------------------------------
  // Obstacle collector
  // ----------------------------------------------
  const handleObstaclesFromChild = useCallback((id, newObs) => {
    obstaclesRef.current = Object.values({
      ...obstaclesRef.current,
      [id]: newObs,
    }).flat();
  }, []);

  // ----------------------------------------------
  // Collision utilities
  // ----------------------------------------------
  const isColliding = createCollisionChecker({
    containerRef,
    obstaclesRef,
    avatarSize,
    COLLISION_EPS: 0,
  });

  const findNearestFreePoint = findNearestFreePointFactory(isColliding);

  // ----------------------------------------------
  // Hooks for movement, camera, keys
  // ----------------------------------------------
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

  // ----------------------------------------------
  // INITIAL MOUNT — Connect Socket + Join
  // ----------------------------------------------
 const selfIdRef = useRef(null);
useEffect(() => {
  selfIdRef.current = selfId;
}, [selfId]);

useEffect(() => {
  console.log("🌍 MAP MOUNT — Initializing socket & presence");

  let hasJoined = false;
  let cleanedUp = false;

  if (mapSocket.connected) {
    leaveMapPresence();
  }

  connectMapSocket();

  const onConnected = () => {
    if (hasJoined || cleanedUp) return;

    setTimeout(() => {
      if (!cleanedUp) {
        joinMapPresence({
          name: username || "Anonymous",
          x: positionRef.current.x,
          y: positionRef.current.y,
        });
        hasJoined = true;
      }
    }, 100);
  };

  if (mapSocket.connected) onConnected();
  else mapSocket.once("connect", onConnected);

  removeMapListeners();

  setupMapListeners({
    onJoinAck: (data) => {
      dispatch(setIdentity({ selfId: data.userId }));
    },

    onState: (data) => {
      if (!selfIdRef.current) {
        console.log("⚠ ignoring presence-sync until selfId is ready");
        return;
      }
      if (!data.avatars?.length) return;

      dispatch(replaceAvatars(data.avatars));
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
    leaveMapPresence();
    removeMapListeners();
    mapSocket.off("connect", onConnected);
  };
}, []);


  // ----------------------------------------------
  // SEND POSITION UPDATES (~16Hz)
  // ----------------------------------------------
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
        updateMapPosition({ x, y });
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------------
  // RENDER
  // ----------------------------------------------
  return (
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
      />

      {/* LOCAL PLAYER */}
      <Avatar
        image={avatar || playerImg}
        size={avatarSize}
        name="You"
        style={{
          position: "absolute",
          top: `${position.y}%`,
          left: `${position.x}%`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* REMOTE PLAYERS */}
      <AvatarsLayer />

      <ClickMarker clickMarker={clickMarker} />
    </MapContainer>
  );
};

export default Map;
