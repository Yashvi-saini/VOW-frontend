import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Avatar from './map assets/avtar';

// Interpolation settings (time-based)
const SPEED_PER_SEC = 10; // higher = faster catch-up to target
const SNAP_DIST = 8; // percent; snap if very far to avoid trails on late joins

// We keep a local interpolation state separate from Redux to avoid mutating store.
const AvatarsLayer = () => {
  const { avatars, selfId } = useSelector(state => state.presence);
  const [renderVersion, setRenderVersion] = useState(0); // force re-render on avatar list changes
  const interpRef = useRef({}); // userId -> { x, y }
  const domRefs = useRef({}); // userId -> element
  const lastFrameRef = useRef(performance.now());
  const rafRef = useRef();

  // Sync interpolation targets when avatar set changes
  useEffect(() => {
    const ids = Object.keys(avatars || {});
    console.log('[avatars] remote list update (excluding self)', ids, 'selfId=', selfId);
    // Remove stale ids
    Object.keys(interpRef.current).forEach(id => {
      if (!avatars[id]) delete interpRef.current[id];
    });
    // Add new ids
    Object.values(avatars).forEach(a => {
      if (!interpRef.current[a.userId]) {
        interpRef.current[a.userId] = { x: a.x, y: a.y };
      }
    });
    // Trigger a render to place new DOM nodes
    setRenderVersion(v => v + 1);
  }, [avatars]);

  useEffect(() => {
    function step(now) {
      const dt = Math.max(0, now - lastFrameRef.current);
      const alpha = 1 - Math.exp(-SPEED_PER_SEC * (dt / 1000));
      Object.values(avatars).forEach(a => {
        if (a.userId === selfId) return; // skip self
        const interp = interpRef.current[a.userId];
        if (!interp) return;
        const dx = a.targetX - interp.x;
        const dy = a.targetY - interp.y;
        const dist = Math.hypot(dx, dy);
        if (dist > SNAP_DIST) {
          // snap if too far (late join or teleport)
          interp.x = a.targetX;
          interp.y = a.targetY;
        } else {
          interp.x += dx * alpha;
          interp.y += dy * alpha;
        }
        const el = domRefs.current[a.userId];
        if (el) {
          el.style.transform = 'translate(-50%, -50%)';
          el.style.top = interp.y + '%';
          el.style.left = interp.x + '%';
        }
      });
      lastFrameRef.current = now;
      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [avatars, selfId]);

  return (
    <>
      {Object.values(avatars).filter(a => a.userId !== selfId).map(a => (
        <div
          key={a.userId}
          ref={el => { if (el) domRefs.current[a.userId] = el; }}
          style={{ position: 'absolute', top: interpRef.current[a.userId]?.y + '%', left: interpRef.current[a.userId]?.x + '%', transform: 'translate(-50%, -50%)' }}
        >
          <Avatar
            size={55}
            name={a.name}
          />
          <div className="text-xs text-white text-center mt-1 drop-shadow">{a.name}</div>
        </div>
      ))}
    </>
  );
};

export default AvatarsLayer;
