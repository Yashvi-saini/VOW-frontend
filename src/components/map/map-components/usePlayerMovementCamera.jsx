import { useEffect, useRef } from "react";

// Handles avatar physics movement and camera follow logic
export function usePlayerMovementCamera({
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
}) {
  // Track when camera starts moving to zero velocity once for smooth perception
  const wasCameraMovingRef = useRef(false);
  useEffect(() => {
    let lastTime = performance.now();
    const step = () => {
      const now = performance.now();
      const dt = Math.min(32, now - lastTime);
      lastTime = now;

      let { x, y } = positionRef.current;
      let { vx, vy } = velocityRef.current;
      let arrived = false;

      const target = moveToTargetRef.current;
      if (target) {
        const dx = target.x - x;
        const dy = target.y - y;
        const dist = Math.hypot(dx, dy);
        const STOP_THRESHOLD = 0.2;
        if (dist < STOP_THRESHOLD) {
          x = target.x; y = target.y; vx = 0; vy = 0;
          positionRef.current = { x, y }; velocityRef.current = { vx, vy };
          setPosition({ x, y });
          moveToTargetRef.current = null;
          if (typeof setClickMarker === "function") {
            try { setClickMarker(null); } catch (_) {}
          }
          arrived = true;
        } else {
          const dirX = dx / (dist || 1); const dirY = dy / (dist || 1);
          const SLOW_RADIUS = 6; const MAX_ACCEL = 0.35;
          const speedFactor = Math.min(1, dist / SLOW_RADIUS);
          const desiredSpeed = maxSpeed * speedFactor;
          const desiredVx = dirX * desiredSpeed; const desiredVy = dirY * desiredSpeed;
          let steerX = desiredVx - vx; let steerY = desiredVy - vy;
          const steerMag = Math.hypot(steerX, steerY);
          if (steerMag > MAX_ACCEL) { steerX = (steerX / steerMag) * MAX_ACCEL; steerY = (steerY / steerMag) * MAX_ACCEL; }
          vx += steerX; vy += steerY;
          if (dist < 2.0) {
            const dot = vx * dirX + vy * dirY;
            const vParallelX = dot * dirX; const vParallelY = dot * dirY;
            const vPerpX = vx - vParallelX; const vPerpY = vy - vParallelY;
            const lateralDamp = 0.5;
            vx = vParallelX + vPerpX * (1 - lateralDamp);
            vy = vParallelY + vPerpY * (1 - lateralDamp);
          }
        }
      }

      if (!arrived) {
        if (keysPressed.current.ArrowUp || keysPressed.current.w || keysPressed.current.W) vy -= accel;
        if (keysPressed.current.ArrowDown || keysPressed.current.s || keysPressed.current.S) vy += accel;
        if (keysPressed.current.ArrowLeft || keysPressed.current.a || keysPressed.current.A) vx -= accel;
        if (keysPressed.current.ArrowRight || keysPressed.current.d || keysPressed.current.D) vx += accel;
        vx = Math.max(Math.min(vx, maxSpeed), -maxSpeed); vy = Math.max(Math.min(vy, maxSpeed), -maxSpeed);
        vx *= 1 - friction; vy *= 1 - friction;
        let newX = Math.max(0, Math.min(x + vx, 100)); if (!moveToTargetRef.current && isColliding(newX, y)) { newX = x; vx *= 0.3; }
        let newY = Math.max(0, Math.min(y + vy, 100)); if (!moveToTargetRef.current && isColliding(newX, newY)) { if (isColliding(newX, y)) { newY = y; vy *= 0.3; } else if (isColliding(newX, newY)) { newY = y; vy *= 0.3; } }
        positionRef.current = { x: newX, y: newY }; velocityRef.current = { vx, vy }; setPosition(positionRef.current);
      }

      const world = containerRef.current; const viewport = viewportRef.current;
      if (world && viewport) {
        const ww = world.clientWidth; const wh = world.clientHeight; const vw = viewport.clientWidth; const vh = viewport.clientHeight;
        const ax = (positionRef.current.x / 100) * ww; const ay = (positionRef.current.y / 100) * wh;
        if (followCameraRef.current) {
          const currentLeft = cameraPosRef.current.left; const currentTop = cameraPosRef.current.top;
          const hThresh = vw * DEADZONE_RATIO; const vThresh = vh * DEADZONE_RATIO;
          let targetLeft = currentLeft; let targetTop = currentTop;
          if (ax < currentLeft + hThresh) targetLeft = Math.max(0, ax - hThresh); else if (ax > currentLeft + vw - hThresh) targetLeft = Math.min(ww - vw, ax - vw + hThresh);
          if (ay < currentTop + vThresh) targetTop = Math.max(0, ay - vThresh); else if (ay > currentTop + vh - vThresh) targetTop = Math.min(wh - vh, ay - vh + vThresh);
          cameraTargetRef.current = { left: targetLeft, top: targetTop };

          // Detect beginning of camera motion and zero avatar velocity once
          const dX = cameraTargetRef.current.left - cameraPosRef.current.left;
          const dY = cameraTargetRef.current.top - cameraPosRef.current.top;
          const movingNow = Math.hypot(dX, dY) > 0.5; // pixel threshold
          if (movingNow && !wasCameraMovingRef.current) {
            velocityRef.current = { vx: 0, vy: 0 };
          }
          const alpha = 1 - Math.pow(1 - CAMERA_SMOOTH, dt / 16.67);
          const nextLeft = cameraPosRef.current.left + (cameraTargetRef.current.left - cameraPosRef.current.left) * alpha;
          const nextTop = cameraPosRef.current.top + (cameraTargetRef.current.top - cameraPosRef.current.top) * alpha;
          cameraPosRef.current = { left: nextLeft, top: nextTop };
          viewport.scrollTo({ left: nextLeft, top: nextTop, behavior: "auto" });

          // Update camera moving state
          wasCameraMovingRef.current = movingNow;
        } else {
          cameraPosRef.current = { left: viewport.scrollLeft, top: viewport.scrollTop };
          cameraTargetRef.current = cameraPosRef.current;
          wasCameraMovingRef.current = false;
        }
      }
      animationRef.current = requestAnimationFrame(step);
    };
    const animationRef = { current: null };
    animationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationRef.current);
  }, [accel, maxSpeed, friction, DEADZONE_RATIO, CAMERA_SMOOTH, isColliding]);
}
