// src/components/map/map objects/ManagerCabin.jsx
import React, { useEffect } from "react";
import desk2 from "../map assets/desk2.svg";
import ZoneButton from "../map-components/button.jsx";
/**
 * SupervisorCabin: renders a rectangle and reports a collision box to the parent map.
 * Props:
 * - x, y, width, height: in pixels, top-left anchored relative to the map container
 * - id: unique id for obstacle group (default 'supervisor')
 * - onObstaclesReady: (id, obstacles[]) callback from Map.jsx
 * - containerRef: ref to the world container element
 */
const ManagerCabin = ({
  x,
  y,
  width,
  height,
  title,
  id = "supervisor",
  onObstaclesReady,
  containerRef,
  // Optional collision overrides (independent of visual size)
  collisionWidthPx,
  collisionHeightPx,
  collisionWidthPercent,
  collisionHeightPercent,
}) => {
  useEffect(() => {
    let ro;
    const send = () => {
      const container = containerRef?.current;
      if (!container) return;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!cw || !ch) return;
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const widthPercent =
        typeof collisionWidthPercent === "number"
          ? collisionWidthPercent
          : typeof collisionWidthPx === "number"
          ? (collisionWidthPx / cw) * 100
          : (width / cw) * 100;

      const heightPercent =
        typeof collisionHeightPercent === "number"
          ? collisionHeightPercent
          : typeof collisionHeightPx === "number"
          ? (collisionHeightPx / ch) * 100
          : (height / ch) * 100;

      const obs = [
        {
          id: `${id}-rect`,
          x: (centerX / cw) * 100,
          y: (centerY / ch) * 100,
          width: widthPercent,
          height: heightPercent,
        },
      ];
      onObstaclesReady?.(id, obs);
    };
    send();
    const container = containerRef?.current;
    if (container && "ResizeObserver" in window) {
      ro = new ResizeObserver(send);
      ro.observe(container);
    }
    return () => ro?.disconnect();
  }, [x, y, width, height, id, onObstaclesReady, containerRef, collisionWidthPx, collisionHeightPx, collisionWidthPercent, collisionHeightPercent]);

  return (
    <div
      data-room-id={id === "supervisor" ? "room-supervisor" : `room-${id}`}
      className="absolute bg-[#FFF] border-2 border-[#385D99] border-dashed flex items-center justify-center rounded-lg"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div>
        <img src={desk2} alt="desk" />
      </div>
       <ZoneButton 
        label="Supervisor Cabin" 
        numberOfUsers={1} 
        locked={true} 
      />
    </div>
  );
};

export default ManagerCabin;
