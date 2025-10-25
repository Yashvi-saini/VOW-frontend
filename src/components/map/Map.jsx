import React, { useState, useEffect, useRef } from "react";
import TableStructure from "../map/map objects/TableStructure";
import Avatar from "../map/map assets/avtar";
import playerImg from "../map/map assets/avatar1.jpg";
import CabinStructure from "../map/map objects/cabinStructure";

import ManagerCabin from "./map objects/Manager";
import SupervisorCabin from "./map objects/Supervisor";

const Map = () => {
  //  Multiple players instead of one position
  const [players, setPlayers] = useState([
    { id: "me", name: "You", x: 60, y: 60, image: playerImg }, 
  ]);

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

  //  Receive obstacles from child components
  const handleObstaclesFromChild = (id, newObstacles) => {
    obstaclesByIdRef.current = {
      ...obstaclesByIdRef.current,
      [id]: newObstacles,
    };
    const merged = Object.values(obstaclesByIdRef.current).flat();
    obstaclesRef.current = merged;
    setObstacles(merged);
  };

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
  useEffect(() => {
    let lastTime = performance.now();

    const step = () => {
      const now = performance.now();
      const dt = Math.min(32, now - lastTime);
      lastTime = now;

  const localPlayer = players.find((p) => p.id === localPlayerId);
  if (!localPlayer) return;

  // Use authoritative physics position, not players[] snapshot
  let { x, y } = positionRef.current;
      let { vx, vy } = velocityRef.current;
      let arrivedNow = false;

      // If the user clicked to move, steer toward the target
      const target = moveToTargetRef.current;
      if (target) {
        const dx = target.x - x;
        const dy = target.y - y;
        const dist = Math.hypot(dx, dy);
  const STOP_THRESHOLD = 0.2; // percent units for tighter snapping
        if (dist < STOP_THRESHOLD) {
          // close enough -> snap and stop
          x = target.x;
          y = target.y;
          vx = 0;
          vy = 0;
          positionRef.current = { x, y };
          velocityRef.current = { vx, vy };
          setPosition({ x, y });
          moveToTargetRef.current = null;
          // hide marker once we arrive
          setClickMarker(null);
          arrivedNow = true;
        } else {
          // Better 'arrive' steering to prevent circling around the point
          const dirX = dx / (dist || 1);
          const dirY = dy / (dist || 1);
          const SLOW_RADIUS = 6; // percent range to start slowing down
          const MAX_ACCEL = 0.35; // max steering accel per frame
          // Taper desired speed as we get close
          const speedFactor = Math.min(1, dist / SLOW_RADIUS);
          const desiredSpeed = maxSpeed * speedFactor;
          const desiredVx = dirX * desiredSpeed;
          const desiredVy = dirY * desiredSpeed;
          // Steering force = desired vel - current vel (PD-like)
          let steerX = desiredVx - vx;
          let steerY = desiredVy - vy;
          const steerMag = Math.hypot(steerX, steerY);
          if (steerMag > MAX_ACCEL) {
            steerX = (steerX / steerMag) * MAX_ACCEL;
            steerY = (steerY / steerMag) * MAX_ACCEL;
          }
          vx += steerX;
          vy += steerY;

          // Kill lateral velocity near target to avoid orbiting
          if (dist < 2.0) {
            const dot = vx * dirX + vy * dirY; // component toward target
            const vParallelX = dot * dirX;
            const vParallelY = dot * dirY;
            const vPerpX = vx - vParallelX;
            const vPerpY = vy - vParallelY;
            const lateralDamp = 0.5; // remove 50% of lateral per frame when very close
            vx = vParallelX + vPerpX * (1 - lateralDamp);
            vy = vParallelY + vPerpY * (1 - lateralDamp);
          }
        }
      }

      if (!arrivedNow) {
        // Keyboard input forces (only if we didn't arrive this frame)
        if (keysPressed.current.ArrowUp) vy -= accel;
        if (keysPressed.current.ArrowDown) vy += accel;
        if (keysPressed.current.ArrowLeft) vx -= accel;
        if (keysPressed.current.ArrowRight) vx += accel;

        // Clamp and friction
        vx = Math.max(Math.min(vx, maxSpeed), -maxSpeed);
        vy = Math.max(Math.min(vy, maxSpeed), -maxSpeed);
        vx *= 1 - friction;
        vy *= 1 - friction;

        // Integrate and handle collisions (unless click-move is active)
        let newX = Math.max(0, Math.min(x + vx, 100));
        if (!moveToTargetRef.current && isColliding(newX, y)) {
          newX = x; 
          vx *= 0.3; 
        }

        let newY = Math.max(0, Math.min(y + vy, 100));
        if (!moveToTargetRef.current && isColliding(newX, newY)) {
          if (isColliding(newX, y)) {
            newY = y;
            vy *= 0.3;
          } else if (isColliding(newX, newY)) {
            newY = y;
            vy *= 0.3;
          }
        }

        positionRef.current = { x: newX, y: newY };
        velocityRef.current = { vx, vy };
        setPosition(positionRef.current);
      }
      const world = containerRef.current;
      const viewport = viewportRef.current;
       if (world && viewport) {
        const ww = world.clientWidth;
        const wh = world.clientHeight;
        const vw = viewport.clientWidth;
        const vh = viewport.clientHeight;

        const ax = (positionRef.current.x / 100) * ww;
        const ay = (positionRef.current.y / 100) * wh;

        if (followCameraRef.current) {
          // compute target with deadzone using current camera pos
          const currentLeft = cameraPosRef.current.left;
          const currentTop = cameraPosRef.current.top;

          const horizontalThreshold = vw * DEADZONE_RATIO;
          const verticalThreshold = vh * DEADZONE_RATIO;

          let targetLeft = currentLeft;
          let targetTop = currentTop;

          if (ax < currentLeft + horizontalThreshold) {
            targetLeft = Math.max(0, ax - horizontalThreshold);
          } else if (ax > currentLeft + vw - horizontalThreshold) {
            targetLeft = Math.min(ww - vw, ax - vw + horizontalThreshold);
          }
          if (ay < currentTop + verticalThreshold) {
            targetTop = Math.max(0, ay - verticalThreshold);
          } else if (ay > currentTop + vh - verticalThreshold) {
            targetTop = Math.min(wh - vh, ay - vh + verticalThreshold);
          }

          cameraTargetRef.current = { left: targetLeft, top: targetTop };

          // time-correct smoothing factor
          const alpha = 1 - Math.pow(1 - CAMERA_SMOOTH, dt / 16.67);

          // lerp camera pos toward target
          const nextLeft = cameraPosRef.current.left + (cameraTargetRef.current.left - cameraPosRef.current.left) * alpha;
          const nextTop = cameraPosRef.current.top + (cameraTargetRef.current.top - cameraPosRef.current.top) * alpha;
          cameraPosRef.current = { left: nextLeft, top: nextTop };

          viewport.scrollTo({ left: nextLeft, top: nextTop, behavior: "auto" });
        } else {
          // if user is manually panning, keep refs synced
          cameraPosRef.current = { left: viewport.scrollLeft, top: viewport.scrollTop };
          cameraTargetRef.current = cameraPosRef.current;
        }
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationRef.current);
  }, [players]);

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
    <div
      ref={viewportRef}
      className="w-full h-screen overflow-auto bg-white"
      style={{
        touchAction: "pan-x pan-y",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        ref={containerRef}
      onClick={handleMapClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-screen bg-white overflow-hidden shadow-md border border-gray-200"
      style={{
        width: 2720,
        height: 2080,
        cursor: cursorBlocked ? "not-allowed" : "pointer",
      }}
      >
        {/* Map objects */}
        <TableStructure
          id="tableA"
          onObstaclesReady={handleObstaclesFromChild}
          containerRef={containerRef}
          position={{ x: 15, y: 25 }}
        />
        <TableStructure
          id="tableB"
          onObstaclesReady={handleObstaclesFromChild}
          containerRef={containerRef}
          position={{ x: 15, y: 80 }}
        />
        <CabinStructure
          id="cabin"
          onObstaclesReady={handleObstaclesFromChild}
          containerRef={containerRef}
          position={{ x: 60, y: 40 }}
        />
        <ManagerCabin
        x={2239} y={240} width={323} height={240} />
        <SupervisorCabin
        x={802} y={1682} width={323} height={240} />

        {/*  Render all avatars */}
        {players.map((player) => {
          const isLocal = player.id === localPlayerId;
          const renderX = isLocal ? position.x : player.x;
          const renderY = isLocal ? position.y : player.y;
          return (
            <Avatar
              key={player.id}
              image={player.image}
              size={avatarSize}
              name={player.name}
              style={{
                position: "absolute",
                top: `${renderY}%`,
                left: `${renderX}%`,
                transform: "translate(-50%, -50%)",
                willChange: "top, left, transform",
              }}
            />
          );
        })}

        {/* Click marker should be positioned in the same world container */}
        {clickMarker && (
          <div
            style={{
              position: "absolute",
              top: `${clickMarker.y}%`,
              left: `${clickMarker.x}%`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            {(() => {
              const valid = clickMarker.valid !== false;
              const ringClass = valid
                ? "bg-blue-400 opacity-50"
                : "bg-red-500 opacity-60";
              const coreClass = valid ? "bg-blue-600" : "bg-red-600";
              return (
                <>
                  <span
                    className={`absolute inline-flex h-8 w-8 rounded-full ${ringClass} animate-ping`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${coreClass} shadow`}
                  ></span>
                  {!valid && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-800">
                      X
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

    </div>
  );
};

export default Map;
