// BigTableStructure.jsx (single image with a collision box)
import React, { useEffect, useRef } from "react";
import bigtable from "../map assets/big table.svg";
import ZoneButton from "../map-components/button.jsx"
const DEFAULT_TABLE_POSITION = Object.freeze({ x: 25, y: 25 });
const BigTableStructure = ({
  id = "bigtable",
  onObstaclesReady,
  position,
  containerRef,
  imageSize,     
  imageWidth,     
  imageHeight,    

  collisionWidthPx,
  collisionHeightPx,
  // Or percent override relative to container (0-100)
  collisionWidthPercent,
  collisionHeightPercent,
  // Optional padding (can be negative) applied after size selection (px)
  collisionPaddingPx = 0,
}) => {
  const tableRef = useRef(null);
  const bigTableRef = useRef(null);
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
        const obstacles = [];


        const containerRect = container.getBoundingClientRect();
        const scaleX = containerRect.width / containerWidth;
        const scaleY = containerRect.height / containerHeight;
        let centerXpx; let centerYpx; let baseWidthPx; let baseHeightPx;

        const tableEl = bigTableRef.current;
        if (tableEl) {
          const tableRect = tableEl.getBoundingClientRect();

          centerXpx = (tableRect.left - containerRect.left + tableRect.width / 2) / (scaleX || 1);
          centerYpx = (tableRect.top - containerRect.top + tableRect.height / 2) / (scaleY || 1);
          baseWidthPx = tableRect.width / (scaleX || 1);
          baseHeightPx = tableRect.height / (scaleY || 1);
        } else {

          centerXpx = (tablePosition.x / 100) * containerWidth;
          centerYpx = (tablePosition.y / 100) * containerHeight;

          baseWidthPx = 220;
          baseHeightPx = 120;
        }

        let finalWidthPercent;
        let finalHeightPercent;
        if (Number.isFinite(collisionWidthPercent) && Number.isFinite(collisionHeightPercent)) {
          finalWidthPercent = collisionWidthPercent;
          finalHeightPercent = collisionHeightPercent;
        } else {
          let widthPx = Number.isFinite(collisionWidthPx) ? collisionWidthPx : baseWidthPx;
          let heightPx = Number.isFinite(collisionHeightPx) ? collisionHeightPx : baseHeightPx;
          if (collisionPaddingPx) {
            widthPx += collisionPaddingPx * 2;
            heightPx += collisionPaddingPx * 2;
          }
          finalWidthPercent = (widthPx / containerWidth) * 100;
          finalHeightPercent = (heightPx / containerHeight) * 100;
        }

        const xPercent = (centerXpx / containerWidth) * 100;
        const yPercent = (centerYpx / containerHeight) * 100;

        obstacles.push({
          id: `${id}-big-table`,
          x: xPercent,
          y: yPercent,
          width: finalWidthPercent,
          height: finalHeightPercent,
        });

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
  }, [id, containerRef, tablePosition.x, tablePosition.y, imageSize, imageWidth, imageHeight, collisionWidthPx, collisionHeightPx, collisionWidthPercent, collisionHeightPercent, collisionPaddingPx]);

  return (
    <div
      ref={tableRef}
      data-room-id={"room-bigtable"}
      className="absolute border-2 border-dashed border-[#385D99] rounded-lg"
      style={{
        width: "400px",
        height: "620px",
        top: `${tablePosition.y}%`,
        left: `${tablePosition.x}%`,
        transform: "translate(-50%, -50%)",
      }}
    >

      <img
        ref={bigTableRef}
        src={bigtable}
        alt=""
        className="absolute pointer-events-none select-none top-1/2 left-1/2"
        style={{
          width: (typeof imageWidth === 'number') ? imageWidth : (typeof imageSize === 'number' ? imageSize : 220),
          height: (typeof imageHeight === 'number') ? imageHeight : (typeof imageSize === 'number' ? imageSize : 120),
          transform: "translate(-50%, -50%)",
        }}
      />
      <ZoneButton 
       label="Conference Hall" 
       numberOfUsers={16} 
       locked={true} 
     />
    </div>
  );
};

export default BigTableStructure;
