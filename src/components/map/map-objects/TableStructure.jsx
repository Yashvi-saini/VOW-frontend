// TableStructure.jsx (recreated to use a single image with a collision box)
import React, { useEffect, useRef } from "react";
import small_room from "../map assets/small room.svg";
import ZoneButton from "../map-components/button.jsx"
const DEFAULT_TABLE_POSITION = Object.freeze({ x: 25, y: 25 });
const TableStructure = ({
  id = "table",
  onObstaclesReady,
  position,
  containerRef,
  imageSize,      // optional square size (px)
  imageWidth,     // optional width (px)
  imageHeight,    // optional height (px)
  // Collision overrides (independent box even if image scales)
  collisionWidthPx,
  collisionHeightPx,
  collisionWidthPercent,
  collisionHeightPercent,
}) => {
  const tableRef = useRef(null);
  const smallRoomRef = useRef(null);
  const tablePosition = position ?? DEFAULT_TABLE_POSITION;

  const notifyObstacles = onObstaclesReady;


  useEffect(() => {
    let ro;

    const setup = () => {
      const container = containerRef?.current;
      if (!container) {
      
        requestAnimationFrame(setup);
        return;
      }

      const computeAndSend = () => {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

  
        if (!containerWidth || !containerHeight) {
          notifyObstacles?.(id, []);
          return;
        }

        // Start with no obstacles from legacy rectangles; we only use the image bounds now.
        const obstacles = [];

        // Also add a collision box for the small room SVG, measured from its DOM box
        const roomEl = smallRoomRef.current;
        if (roomEl) {
          const containerRect = container.getBoundingClientRect();
          const roomRect = roomEl.getBoundingClientRect();
          if (roomRect.width > 0 && roomRect.height > 0) {
            // Adjust for world scale: convert measured (scaled) px back to unscaled px
            const scaleX = containerRect.width / containerWidth;
            const scaleY = containerRect.height / containerHeight;
            const centerXpx = (roomRect.left - containerRect.left + roomRect.width / 2) / (scaleX || 1);
            const centerYpx = (roomRect.top - containerRect.top + roomRect.height / 2) / (scaleY || 1);
            const measuredWidthPx = roomRect.width / (scaleX || 1);
            const measuredHeightPx = roomRect.height / (scaleY || 1);
            const xPercent = (centerXpx / containerWidth) * 100;
            const yPercent = (centerYpx / containerHeight) * 100;

            // Allow overrides to replace measured dimensions
            const widthPercent =
              typeof collisionWidthPercent === 'number'
                ? collisionWidthPercent
                : typeof collisionWidthPx === 'number'
                ? (collisionWidthPx / containerWidth) * 100
                : (measuredWidthPx / containerWidth) * 100;

            const heightPercent =
              typeof collisionHeightPercent === 'number'
                ? collisionHeightPercent
                : typeof collisionHeightPx === 'number'
                ? (collisionHeightPx / containerHeight) * 100
                : (measuredHeightPx / containerHeight) * 100;

            obstacles.push({
              id: `${id}-small-room`,
              x: xPercent,
              y: yPercent,
              width: widthPercent - 3,
              height: heightPercent - 2,
            });
          }
        }

          const valid = obstacles.filter(
            (o) => Number.isFinite(o.x) && Number.isFinite(o.y) && Number.isFinite(o.width) && Number.isFinite(o.height) && o.width > 0 && o.height > 0
          );

          notifyObstacles?.(id, valid);
      };

      computeAndSend();
      ro = new ResizeObserver(() => computeAndSend());
      ro.observe(container);
    };

    setup();
    return () => ro?.disconnect();
  }, [id, containerRef, tablePosition.x, tablePosition.y, imageSize, imageWidth, imageHeight, collisionWidthPx, collisionHeightPx, collisionWidthPercent, collisionHeightPercent]);

  return (
    <div
      ref={tableRef}
      data-room-id={id === "tableA" ? "room-tableA" : id === "tableB" ? "room-tableB" : `room-${id}`}
      className="absolute  border-2 border-dashed border-[#385D99] rounded-lg"
      style={{
        width: "400px",
        height: "620px",
        top: `${tablePosition.y}%`,
        left: `${tablePosition.x}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Single image representing the structure; its bounds are used as the collision box */}
      <img
        ref={smallRoomRef}
        src={small_room}
        alt=""
        className="absolute pointer-events-none select-none top-1/2 left-1/2"
        style={{
          width: (typeof imageWidth === 'number') ? imageWidth : (typeof imageSize === 'number' ? imageSize : 220),
          height: (typeof imageHeight === 'number') ? imageHeight : (typeof imageSize === 'number' ? imageSize : 120),
          transform: "translate(-50%, -50%)",
        }}
      />
        <ZoneButton 
         label="Discussion Room" 
         numberOfUsers={10} 
         locked={true} 
       />
    </div>
  );
};

export default TableStructure;
