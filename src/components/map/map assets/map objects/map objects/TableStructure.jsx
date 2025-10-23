// TableStructure.jsx
import React, { useEffect, useRef } from "react";
import seat from "../assets/seat.svg";
import OuterRectangle from "../map assets/OuterRectangle";
import InnerRectangle from "../map assets/InnerRectangle";

// Stable default to avoid new object identity on each render
const DEFAULT_TABLE_POSITION = Object.freeze({ x: 25, y: 25 });
const TABLE_SIZE_PX = 400;

const TableStructure = ({id="table", onObstaclesReady, position, containerRef }) => {
  const tableRef = useRef(null);
  const tablePosition = position ?? DEFAULT_TABLE_POSITION;
  // Alias to avoid any accidental shadowing and keep a stable symbol name
  const notifyObstacles = onObstaclesReady;

  // Define relative geometry from the SVGs (in table %)
  // These coordinates are centered within the table (50,50)
  const tableObstacles = [
    {
      id: `${id}-outerRect`,
      x: 50,
      y: 50,
      width: 26.25,
      height: 55,
    },
    {
      id: `${id}-innerRect`,
      x: 50,
      y: 50,
      width: 25,
      height: 52.5,
    },
  ];

  // Compute table obstacles in map percentages and send to parent (with id)
  useEffect(() => {
    let ro;

    const setup = () => {
      const container = containerRef?.current;
      if (!container) {
        // Try again on next frame until container is ready
        requestAnimationFrame(setup);
        return;
      }

      const computeAndSend = () => {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // If container hasn't measured yet, send empty to avoid false collisions
        if (!containerWidth || !containerHeight) {
          notifyObstacles?.(id, []);
          return;
        }

        // Convert table-relative % to map-relative % (global positioning)
        const obstacles = tableObstacles.map((obs) => {
          // Convert table center from % to px within map container
          const tableXInPx = (tablePosition.x / 100) * containerWidth;
          const tableYInPx = (tablePosition.y / 100) * containerHeight;

          // Position of obstacle center within the map (obs is relative to table center)
          const obsXInPx = tableXInPx + ((obs.x - 50) / 100) * TABLE_SIZE_PX;
          const obsYInPx = tableYInPx + ((obs.y - 50) / 100) * TABLE_SIZE_PX;

          // Convert to map-relative %
          const xPercent = (obsXInPx / containerWidth) * 100;
          const yPercent = (obsYInPx / containerHeight) * 100;
          const widthPercent = ((obs.width / 100) * TABLE_SIZE_PX / containerWidth) * 100;
          const heightPercent = ((obs.height / 100) * TABLE_SIZE_PX / containerHeight) * 100;

          return { ...obs, x: xPercent, y: yPercent, width: widthPercent, height: heightPercent };
        });

          // Filter out any invalid sizes
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
  }, [id, containerRef, tablePosition.x, tablePosition.y]);

  return (
    <div
      ref={tableRef}
      className="absolute"
      style={{
        width: "400px",
        height: "400px",
        top: `${tablePosition.y}%`,
        left: `${tablePosition.x}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Outer Rectangle SVG */}
      <OuterRectangle 
        className="absolute top-1/2 left-1/2"
        style={{ width: "105px", height: "220px", transform: "translate(-50%, -50%)" }}
      />

      {/* Inner Rectangle SVG */}
      <InnerRectangle 
        className="absolute top-1/2 left-1/2"
        style={{ width: "100px", height: "210px", transform: "translate(-50%, -50%)" }}
      />

      {/* Seats */}
      <img src={seat} alt="Seat" className="absolute left-1/2" style={{ top: "50px", width: "25px", transform: "translateX(-40px) rotate(90deg)" }} />
      <img src={seat} alt="Seat" className="absolute left-1/2" style={{ top: "50px", width: "25px", transform: "translateX(20px) rotate(90deg)" }} />
      <img src={seat} alt="Seat" className="absolute left-1/2" style={{ bottom: "50px", width: "25px", transform: "translateX(-40px) rotate(270deg)" }} />
      <img src={seat} alt="Seat" className="absolute left-1/2" style={{ bottom: "50px", width: "25px", transform: "translateX(20px) rotate(270deg)" }} />
      <img src={seat} alt="Seat" className="absolute" style={{ top: "110px", left: "105px", width: "25px" }} />
      <img src={seat} alt="Seat" className="absolute" style={{ top: "160px", left: "105px", width: "25px" }} />
            <img src={seat} alt="Seat" className="absolute" style={{ top: "210px", left: "105px", width: "25px" }} />
                  <img src={seat} alt="Seat" className="absolute" style={{ top: "260px", left: "105px", width: "25px" }} />
                  <img src={seat} alt="Seat" className="absolute" style={{ bottom: "210px", right: "105px", width: "25px", transform: "rotate(180deg)" }} />
                  <img src={seat} alt="Seat" className="absolute" style={{ bottom: "260px", right: "105px", width: "25px", transform: "rotate(180deg)" }} />
      <img src={seat} alt="Seat" className="absolute" style={{ bottom: "160px", right: "105px", width: "25px", transform: "rotate(180deg)" }} />
      <img src={seat} alt="Seat" className="absolute" style={{ bottom: "110px", right: "105px", width: "25px", transform: "rotate(180deg)" }} />

      {/* 🔴 Debug obstacle overlay (optional) */}
      
    </div>
  );
};

export default TableStructure;
