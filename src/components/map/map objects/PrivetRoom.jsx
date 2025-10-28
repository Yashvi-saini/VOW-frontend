import React, { useEffect, useRef } from "react";
import privateroomdesk from "../map assets/privateroomdesk.svg";
/**
 * PrivateRoom: renders a cabin with multiple desk images and reports a collision box for each image.
 * Props:
 * - x, y, width, height: in pixels, top-left anchored relative to the map container
 * - id: unique id for obstacle group (default 'privateRoom')
 * - onObstaclesReady: (id, obstacles[]) callback from Map.jsx
 * - containerRef: ref to the world container element
 */
const PrivateRoom = ({ x, y, width, height, title, id = "privateRoom", onObstaclesReady, containerRef }) => {
  const wrapperRef = useRef(null);
  const imgRefs = useRef([]);

  useEffect(() => {
    let ro;
    const send = () => {
      const container = containerRef?.current;
      if (!container) return;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!cw || !ch) return;

      const containerRect = container.getBoundingClientRect();

      // Build obstacles for each desk image by measuring its DOM box
      const obstacles = (imgRefs.current || [])
        .filter(Boolean)
        .map((el, idx) => {
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return null;
          // Adjust for any CSS scale by comparing DOMRect to clientWidth/Height
          const scaleX = containerRect.width / cw || 1;
          const scaleY = containerRect.height / ch || 1;
          const centerXpx = (r.left - containerRect.left + r.width / 2) / scaleX;
          const centerYpx = (r.top - containerRect.top + r.height / 2) / scaleY;
          const widthPx = r.width / scaleX;
          const heightPx = r.height / scaleY;
          return {
            id: `${id}-img-${idx}`,
            x: (centerXpx / cw) * 100,
            y: (centerYpx / ch) * 100,
            width: (widthPx / cw) * 100,
            height: (heightPx / ch) * 100,
          };
        })
        .filter(Boolean);

      onObstaclesReady?.(id, obstacles);
    };

    send();
    const container = containerRef?.current;
    if (container && "ResizeObserver" in window) {
      ro = new ResizeObserver(send);
      ro.observe(container);
    }
    return () => ro?.disconnect();
  }, [x, y, width, height, id, onObstaclesReady, containerRef]);

  return (
    <div
      ref={wrapperRef}
  className="absolute bg-[#FFF] border-2 border-[#385D99] border-dashed flex items-center justify-center"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className="flex gap-[100px]">
        <img ref={(el) => (imgRefs.current[0] = el)} src={privateroomdesk} alt="desk" />
        <img ref={(el) => (imgRefs.current[1] = el)} src={privateroomdesk} alt="desk" />
        <img ref={(el) => (imgRefs.current[2] = el)} src={privateroomdesk} alt="desk" />
        <img ref={(el) => (imgRefs.current[3] = el)} src={privateroomdesk} alt="desk" />
     </div>
    </div>
  );
};

export default PrivateRoom;