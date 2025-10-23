// Map.jsx
import React, { useState, useEffect, useRef } from "react";
import TableStructure from "./map/map objects/TableStructure";
import Avatar from "./map assets/avtar";
import playerImg from "../assets/avatar1.jpg";

const Map = () => {
  const [position, setPosition] = useState({ x: 60, y: 60 });
  const [obstacles, setObstacles] = useState([]);
  
  // Refs for smooth, frame-based physics
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
  // Movement physics
  const avatarSize = 65;
  const accel = 0.15;
  const maxSpeed = 1;
  const friction = 0.12;
  const COLLISION_EPS = 0.05; 

  // Receive obstacles from TableStructure
  const handleObstaclesFromChild = (id, newObstacles) => {
    obstaclesByIdRef.current = {
      ...obstaclesByIdRef.current,
      [id]: newObstacles,
    };
    const merged = Object.values(obstaclesByIdRef.current).flat();
    obstaclesRef.current = merged;
    setObstacles(merged);
  };

  // Collision detection
  const isColliding = (newX, newY, eps = COLLISION_EPS) => {
    if (!containerRef.current) return false;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const avatarWidthPercent = (avatarSize / containerWidth) * 100;
    const avatarHeightPercent = (avatarSize / containerHeight) * 100;

    return obstaclesRef.current.some((obs) => {
      if (!Number.isFinite(obs.x) || !Number.isFinite(obs.y) || !Number.isFinite(obs.width) || !Number.isFinite(obs.height) || obs.width <= 0 || obs.height <= 0) {
        return false;
      }
      const avatarLeft = newX - avatarWidthPercent / 2;
      const avatarRight = newX + avatarWidthPercent / 2;
      const avatarTop = newY - avatarHeightPercent / 2;
      const avatarBottom = newY + avatarHeightPercent / 2;

      // Obstacles are center-aligned (transform: translate(-50%, -50%))
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
    const isMoveKey = (k) =>
      ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","W","A","S","D"].includes(k);
    const down = (e) => {
      
      if (isMoveKey(e.key)) {
        e.preventDefault();
        followCameraRef.current = true; // resume camera follow after manual pan
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
 useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = () => {
      
      followCameraRef.current = false;
    };
    const anyMoveKeyDown = () =>
      ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","W","A","S","D"].some(
        (k) => !!keysPressed.current[k]
      );
    const onPointerDown = () => {
      userPanningRef.current = true;
      followCameraRef.current = false;
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
  
  useEffect(() => {
    let lastTime = performance.now();

    const step = () => {
      const now = performance.now();
      const dt = Math.min(32, now - lastTime); 
      lastTime = now;

      
      let { x, y } = positionRef.current;
      let { vx, vy } = velocityRef.current;

      
      if (keysPressed.current.ArrowUp) vy -= accel;
      if (keysPressed.current.ArrowDown) vy += accel;
      if (keysPressed.current.ArrowLeft) vx -= accel;
      if (keysPressed.current.ArrowRight) vx += accel;

    
      vx = Math.max(Math.min(vx, maxSpeed), -maxSpeed);
      vy = Math.max(Math.min(vy, maxSpeed), -maxSpeed);

    
      vx *= 1 - friction;
      vy *= 1 - friction;

      
      let newX = Math.max(0, Math.min(x + vx, 100));
      if (isColliding(newX, y)) {
        newX = x; 
        vx *= 0.3; 
      }

      let newY = Math.max(0, Math.min(y + vy, 100));
      if (isColliding(newX, newY)) {
      
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
      const world = containerRef.current;
      const viewport = viewportRef.current;
       if (world && viewport && followCameraRef.current) {
        const ww = world.clientWidth;
        const wh = world.clientHeight;
        const vw = viewport.clientWidth;
        const vh = viewport.clientHeight;
        const ax = (positionRef.current.x / 100) * ww;
        const ay = (positionRef.current.y / 100) * wh;
        const left = Math.max(0, Math.min(ax - vw / 2, ww - vw));
        const top = Math.max(0, Math.min(ay - vh / 2, wh - vh));
        viewport.scrollTo({ left, top, behavior: "auto" });
      }
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
      <div ref={viewportRef} className="w-full h-screen overflow-auto bg-white"
      style={{
        touchAction: "pan-x pan-y",          
        WebkitOverflowScrolling: "touch",    
      }}
      >
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-white overflow-hidden shadow-md border border-gray-200"
      style={{ width: 2000, height: 1200 }}
    >
      
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
    
     
      <Avatar
        image={playerImg}
        size={avatarSize}
        name="Sarthak"
        style={{
          position: "absolute",
          top: `${position.y}%`,
          left: `${position.x}%`,
          transform: "translate(-50%, -50%)",
          willChange: "top, left, transform",
        }}
      />
    </div></div>
  );
};
export default Map;