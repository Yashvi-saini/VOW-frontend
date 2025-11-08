import React,{useEffect} from "react";
import joystickleft from "../map assets/joystickleft.svg";
import table from "../map assets/table.svg";
import ZoneButton from "../map-components/button.jsx"
const Gaming = ({
  x,
  y,
  width,
  height,
  title,
  id = "gaming",
  roomId,
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
          typeof collisionWidthPercent === 'number'
            ? collisionWidthPercent
            : typeof collisionWidthPx === 'number'
            ? (collisionWidthPx / cw) * 100
            : (width / cw) * 100;

        const heightPercent =
          typeof collisionHeightPercent === 'number'
            ? collisionHeightPercent
            : typeof collisionHeightPx === 'number'
            ? (collisionHeightPx / ch) * 100
            : (height / ch) * 100;

        const obs = [{
          id: `${id}-rect`,
          x: (centerX / cw) * 100,
          y: (centerY / ch) * 100,
          width: widthPercent,
          height: heightPercent,
        }];
        onObstaclesReady?.(id, obs);
      };
      send();
      const container = containerRef?.current;
      if (container && 'ResizeObserver' in window) {
        ro = new ResizeObserver(send);
        ro.observe(container);
      }
      return () => ro?.disconnect();
    }, [x, y, width, height, id, onObstaclesReady, containerRef, collisionWidthPx, collisionHeightPx, collisionWidthPercent, collisionHeightPercent]);
  return (
    <div
      className="absolute bg-[#FFF] border-2 border-[#385D99] border-dashed flex items-center justify-center rounded-lg "
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      data-room-id={roomId || (id === "gaming" ? "room-gaming" : `room-${id}`)}
    >
      
      <div className="relative ">
        <img src={table} alt="base table"  />
  <div className="absolute w-12 h-12 right-[115px] top-[15px] bottom-3.5">
          <img
            src={joystickleft}
            alt="Left Joystick"
            className="w-full h-full "
          />
        </div>
  <div className="absolute w-12 h-12 left-[115px] top-[15px] bottom-3.5">
          <img
            src={joystickleft}
            alt="Right Joystick"
            className="w-full h-full rotate-180"
          />
        </div>
      </div>
        <ZoneButton 
         label="Gaming Section" 
         numberOfUsers={2} 
         locked={true} 
       />
    </div>
  );
};

export default Gaming;