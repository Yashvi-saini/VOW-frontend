import React, { useState, useEffect, useRef, useCallback } from "react";
import TableStructure from "../map/map objects/TableStructure";
import Avatar from "../map/map assets/avtar";
import playerImg from "../map/map assets/avatar1.jpg";
import { socket } from "../../socket";
import MapContainer from "./MapContainer";
import MapObjects from "./MapObjects";
import AvatarLayer from "./AvatarLayer";
import ClickMarker from "./ClickMarker";
import { usePlayerMovement } from "../map/map-components/usePlayermovement";


const Map = ({
  viewportRef,
  containerRef,
  cursorBlocked,
  handleMapClick,
  handlePointerMove,
  handlePointerLeave,
  handleObstaclesFromChild,
  members,
  localPlayerId,
  localPosition,
  avatarSize,
  clickMarker
})=> {
  //  Multiple players instead of one position
    const [members, setMembers] = useState([]);

  // Local player ID (the one that moves)
  const localPlayerId = "me";

  // Static data
  const [position, setPosition] = useState({ x: 60, y: 60 });
  const [clickMarker, setClickMarker] = useState(null); // {x, y, valid }
  const [cursorBlocked, setCursorBlocked] = useState(false);
  const [obstacles, setObstacles] = useState([]);

  // Refs for smooth physics
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
  // clear allowMap once map mounts so direct visits afterwards are blocked
  useEffect(() => {
    try {
      sessionStorage.removeItem("allowMap");
    } catch (e) {}
  }, []);
  // When a user clicks the map we store a target here (percent coords)
  const moveToTargetRef = useRef(null);
  const DEADZONE_RATIO = 0.30;   // 30% margin per side
  const CAMERA_SMOOTH = 0.18;
  // Movement physics
  const avatarSize = 65;
  const accel = 0.03;
  const maxSpeed = 0.5;
  const friction = 0.12;
  const COLLISION_EPS = 0.0; 

  //  Receive obstacles from child components (memoized to avoid re-creating each render)
  const handleObstaclesFromChild = useCallback((id, newObstacles) => {
    obstaclesByIdRef.current = {
      ...obstaclesByIdRef.current,
      [id]: newObstacles,
    };
    const merged = Object.values(obstaclesByIdRef.current).flat();
    obstaclesRef.current = merged;
    // Only update state if changed length or content reference differs
    setObstacles((prev) => (prev === merged ? prev : merged));
  }, []);

  //  Collision detection
  const isColliding = (newX, newY, eps = COLLISION_EPS) => {
    if (!containerRef.current) return false;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const avatarWidthPercent = (avatarSize / containerWidth) * 100;
    const avatarHeightPercent = (avatarSize / containerHeight) * 100;

    return obstaclesRef.current.some((obs) => {
      if (
        !Number.isFinite(obs.x) ||
        !Number.isFinite(obs.y) ||
        !Number.isFinite(obs.width) ||
        !Number.isFinite(obs.height) ||
        obs.width <= 0 ||
        obs.height <= 0
      )
        return false;

      const avatarLeft = newX - avatarWidthPercent / 2;
      const avatarRight = newX + avatarWidthPercent / 2;
      const avatarTop = newY - avatarHeightPercent / 2;
      const avatarBottom = newY + avatarHeightPercent / 2;

      const obsLeft = obs.x - obs.width / 2 - eps;
      const obsRight = obs.x + obs.width / 2 + eps;
      const obsTop = obs.y - obs.height / 2 - eps;
      const obsBottom = obs.y + obs.height / 2 + eps;

      return (
        avatarRight > obsLeft &&
        avatarLeft < obsRight &&
        avatarBottom > obsTop &&
        avatarTop < obsBottom
      );
    });
  };
useEffect(() => {
  socket.emit("presence:join", { workspaceId });

  socket.on("presence:snapshot", (list) => {
    setMembers(list);
  });

  socket.on("presence:join", (member) => {
    setMembers(prev => [...prev, member]);
  });

  socket.on("presence:leave", ({ userId }) => {
    setMembers(prev => prev.filter(m => m.userId !== userId));
  });

  socket.on("location:update", (update) => {
    setMembers(prev =>
      prev.map(m =>
        m.userId === update.userId ? { ...m, ...update } : m
      )
    );
  });

  return () => {
    socket.off("presence:snapshot");
    socket.off("presence:join");
    socket.off("presence:leave");
    socket.off("location:update");
  };
}, [workspaceId]);
  // Find the nearest non-colliding point around (x,y) in percent units
  // Returns {x, y} or null if none found within search radius
  const findNearestFreePoint = (x, y) => {
    if (!isColliding(x, y)) return { x, y };
    const clamp01 = (v) => Math.max(0, Math.min(100, v));
    const maxRadius = 12; // percent
    const step = 0.6;     // radial step in percent
    const samples = 24;   // angular samples per ring
    let best = null;
    let bestDist2 = Infinity;

    for (let r = step; r <= maxRadius; r += step) {
      for (let i = 0; i < samples; i++) {
        const theta = (i / samples) * Math.PI * 2;
        const cx = clamp01(x + r * Math.cos(theta));
        const cy = clamp01(y + r * Math.sin(theta));
        if (!isColliding(cx, cy)) {
          const dx = cx - x;
          const dy = cy - y;
          const d2 = dx * dx + dy * dy;
          if (d2 < bestDist2) {
            bestDist2 = d2;
            best = { x: cx, y: cy };
          }
        }
      }
      if (best) break; // earliest ring win = nearest
    }
    return best;
  };

  const updateCursorBlocked = (clientX, clientY) => {
    const world = containerRef.current;
    if (!world || typeof clientX !== "number" || typeof clientY !== "number") return;
    const rect = world.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const px = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1));
    const py = Math.max(0, Math.min((clientY - rect.top) / rect.height, 1));
    const tx = px * 100;
    const ty = py * 100;
    const blocked = isColliding(tx, ty);
    setCursorBlocked((prev) => (prev === blocked ? prev : blocked));
  };

  const handlePointerMove = (e) => {
    updateCursorBlocked(e.clientX, e.clientY);
  };

  const handlePointerLeave = () => {
    setCursorBlocked(false);
  };

  
  useEffect(() => {
    const isMoveKey = (k) =>
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "w",
        "a",
        "s",
        "d",
        "W",
        "A",
        "S",
        "D",
      ].includes(k);

    const down = (e) => {
      if (isMoveKey(e.key)) {
        e.preventDefault();
        followCameraRef.current = true;
      }
      keysPressed.current[e.key] = true;
    };

    const up = (e) => {
      if (isMoveKey(e.key)) e.preventDefault();
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // no timers to cleanup
 useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    // init camera refs to current scroll
    cameraPosRef.current = { left: vp.scrollLeft, top: vp.scrollTop };
    cameraTargetRef.current = { left: vp.scrollLeft, top: vp.scrollTop };
  }, []);
  
 useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = () => {
      followCameraRef.current = false;
      cameraPosRef.current = { left: vp.scrollLeft, top: vp.scrollTop };
      cameraTargetRef.current = cameraPosRef.current;
    };

    const onPointerDown = () => {
      userPanningRef.current = true;
      followCameraRef.current = false;
       cameraPosRef.current = { left: vp.scrollLeft, top: vp.scrollTop };
      cameraTargetRef.current = cameraPosRef.current;
    };

    const onPointerUp = () => {
      userPanningRef.current = false;
    };

    vp.addEventListener("wheel", onWheel, { passive: true });
    vp.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      vp.removeEventListener("wheel", onWheel);
      vp.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  //  Core movement + camera follow logic
  usePlayerMovement({
  players,
  localPlayerId,
  positionRef,
  velocityRef,
  setPosition,
  moveToTargetRef,
  setClickMarker,
  keysPressed,
  containerRef,
  viewportRef,
  cameraPosRef,
  cameraTargetRef,
  followCameraRef,
  maxSpeed,
  accel,
  friction,
  isColliding
});


  useEffect(() => {
    const dummyPlayers = [
      { id: "p2", name: "guest1", x: 40, y: 55, image: playerImg }, // hardcoded for now
      { id: "p3", name: "guest2", x: 76, y: 28, image: playerImg },
    ];
    // Guard against double-effect execution in StrictMode / HMR by de-duplicating by id
    setPlayers((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const toAdd = dummyPlayers.filter((p) => !existingIds.has(p.id));
      return toAdd.length ? [...prev, ...toAdd] : prev;
    });
  }, []);
 
  //  Map & avatars rendering
  // Handle clicks on the map: convert client coords to percent (0-100)
  const handleMapClick = (e) => {
    // Ignore clicks originating from UI controls that should not move the avatar
    if (e.target && typeof e.target.closest === 'function') {
      const uiEl = e.target.closest('[data-map-no-move]');
      if (uiEl) return;
    }
    if (e.button && e.button !== 0) return;
    const world = containerRef.current;
    if (!world) return;
    const rect = world.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const px = Math.max(0, Math.min(clickX / rect.width, 1));
    const py = Math.max(0, Math.min(clickY / rect.height, 1));
    const tx = px * 100;
    const ty = py * 100;

    const blocked = isColliding(tx, ty);
    let target = { x: tx, y: ty };
    if (blocked) {
      const nearest = findNearestFreePoint(tx, ty);
      setClickMarker({ x: tx, y: ty, valid: false });
      if (!nearest) {
        moveToTargetRef.current = null;
        return;
      }
      target = nearest;
    } else {
      setClickMarker({ x: tx, y: ty, valid: true });
    }

    moveToTargetRef.current = target;
    followCameraRef.current = true;
  };

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
      <AvatarLayer members={members} localPlayerId={localPlayerId} localPosition={localPosition} avatarSize={avatarSize} />
      <ClickMarker clickMarker={clickMarker} />
    </MapContainer>
  );

};

export default Map;