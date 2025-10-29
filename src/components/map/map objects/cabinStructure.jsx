import React, { useEffect, useRef } from "react";
import DeskUnit from "../map assets/DeskUnit";
const DEFAULT_CABIN_POSITION = Object.freeze({ x: 50, y: 50 });

const CABIN_W = 1288;
const CABIN_H = 1150;
const PADDING = 80; 
const INNER_W = CABIN_W - 2 * PADDING; 
const INNER_H = CABIN_H - 2 * PADDING; 
const ROWS = 5;
const COLS = 4;
const ROW_GAP = 135;
const COL_GAP = 165;

const CabinStructure = ({ id = "cabin", onObstaclesReady, position, containerRef }) => {
  const cabinRef = useRef(null);
  const cabinPosition = position ?? DEFAULT_CABIN_POSITION;

  //desk sizes calculated
 const deskW = Math.round((INNER_W - (COLS - 1) * COL_GAP) / COLS);
  const deskH = Math.round((INNER_H - (ROWS - 1) * ROW_GAP) / ROWS);

  // desks metadata
  const desks = Array.from({ length: ROWS * COLS }).map((_, i) => {
    const r = Math.floor(i / COLS); // 0..4
    const c = i % COLS; // 0..3
    const leftPx = PADDING + c * (deskW + COL_GAP);
    const topPx = PADDING + r * (deskH + ROW_GAP);
    const centerXpx = leftPx + deskW / 2;
    const centerYpx = topPx + deskH / 2;
    return {
      id: `${id}-desk-${i}`,
      index: i,
      leftPx,
      topPx,
      widthPx: deskW,
      heightPx: deskH,
      centerXpx,
      centerYpx,
    };
  });
const COLLISION_Y_OFFSET_FRAC = 0.2;
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
          onObstaclesReady?.(id, []);
          return;
        }

        // cabin center position in container px
        const cabinCenterX = (cabinPosition.x / 100) * containerWidth;
        const cabinCenterY = (cabinPosition.y / 100) * containerHeight;
        const cabinLeftInContainer = cabinCenterX - CABIN_W / 2;
        const cabinTopInContainer = cabinCenterY - CABIN_H / 2;

        const obstacles = desks.map((d) => {
          const obsCenterX = cabinLeftInContainer + d.centerXpx;
          const yOffsetPx = d.heightPx * COLLISION_Y_OFFSET_FRAC;
          const obsCenterY = cabinTopInContainer + d.centerYpx - yOffsetPx;
          return {
            id: d.id,
            x: (obsCenterX / containerWidth) * 100,
            y: (obsCenterY / containerHeight) * 100,
            width: (d.widthPx / containerWidth) * 100,
            height: ((d.heightPx / 2) / containerHeight) * 100+0.3,
          };
        });

        onObstaclesReady?.(id, obstacles);
      };

      computeAndSend();
      ro = new ResizeObserver(() => computeAndSend());
      ro.observe(container);
    };

    setup();
    return () => ro?.disconnect?.();
  }, [id, containerRef, cabinPosition.x, cabinPosition.y]);

  // render
  return (
    <div
      ref={cabinRef}
      className="absolute"
      style={{
        width: `${CABIN_W}px`,
        height: `${CABIN_H}px`,
        top: `${cabinPosition.y}%`,
        left: `${cabinPosition.x}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      
{/*dashed outer box*/}
<div
  className="
    absolute
    top-1/2 left-1/2
    w-[1288px] h-[1150px]
    -translate-x-1/2 -translate-y-1/2
    border-2 border-dashed border-[#385D99]
    rounded-lg
    z-0
  "
/>

      {/* Grid container sits above the outer rectangle */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${CABIN_W}px`,
          height: `${CABIN_H}px`,
          zIndex: 1,
          pointerEvents: "auto",
        }}
      >
        {/* inner grid area positioned using exact px values */}
        <div
          style={{
            position: "absolute",
            top: `${PADDING}px`,
            left: `${PADDING}px`,
            width: `${INNER_W}px`,
            height: `${INNER_H}px`,
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${deskW}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${deskH}px)`,
            columnGap: `${COL_GAP}px`,
            rowGap: `${ROW_GAP}px`,
            boxSizing: "border-box",
          }}
        >
          {desks.map((d) => (
            <div key={d.id} style={{ width: d.widthPx, height: d.heightPx }}>
              <DeskUnit style={{ width: "100%", height: "100%", display: "block" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CabinStructure;

