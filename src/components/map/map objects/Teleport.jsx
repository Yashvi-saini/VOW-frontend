import React from "react"; 
import Teleport from "../map assets/Teleport.svg";
const TeleportButton = ({ x, y, width, height, title }) => {
  return (
    <div
      className="absolute bg-[#FFF] flex items-center justify-center rounded-lg"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className="relative flex items-center justify-center">
        <img src={Teleport} alt="desk" />
        <div className="absolute text-center text-[#5C0EA4] font-inter text-xs font-normal leading-[14.4px]">
          Click or hover to teleport
        </div>
      </div>
      
    </div>
  );
};

export default TeleportButton;