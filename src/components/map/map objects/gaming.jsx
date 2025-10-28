import React from "react";
import joystickleft from "../map assets/joystickleft.svg";
import table from "../map assets/table.svg";
const Gaming = ({ x, y, width, height, title }) => {
  return (
    <div
      className="absolute bg-[#FFF] border-1 border-[#A8C2ED] border-dashed flex items-center justify-center rounded-lg "
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
    </div>
  );
};

export default Gaming;