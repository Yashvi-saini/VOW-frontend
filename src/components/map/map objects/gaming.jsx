import React,{useEffect} from "react";
import joystickleft from "../map assets/joystickleft.svg";
import table from "../map assets/table.svg";
import ZoneButton from "../map-components/button.jsx"
const Gaming = ({ x, y, width, height, title, id = "supervisor", onObstaclesReady, containerRef }) => {


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
        const obs = [{
          id: `${id}-rect`,
          x: (centerX / cw) * 100,
          y: (centerY / ch) * 100,
          width: (width / cw) * 100,
          height: (height / ch) * 100,
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
    }, [x, y, width, height, id, onObstaclesReady, containerRef]);
  return (
    <div
      className="absolute bg-[#FFF] border-2 border-[#385D99] border-dashed flex items-center justify-center rounded-lg "
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      
      <div className="relative ">
        <img src={table} alt="base table"  />
        <div className="absolute w-[48px] h-[48px] right-[115px] top-[15px] bottom-[14px]">
          <img
            src={joystickleft}
            alt="Left Joystick"
            className="w-full h-full "
          />
        </div>
        <div className="absolute w-[48px] h-[48px] left-[115px] top-[15px] bottom-[14px]">
          <img
            src={joystickleft}
            alt="Right Joystick"
            className="w-full h-full rotate-[180deg]"
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