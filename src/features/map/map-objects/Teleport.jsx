import React from "react"; 
import Teleport from "../map assets/Teleport.svg";
const TeleportButton = ({ x, y, width, height, title, onClick }) => {
  return (
    <div
      data-map-no-move
      role="button"
      tabIndex={0}
      title="Teleport"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className="absolute bg-[#FFF] flex items-center justify-center rounded-lg cursor-pointer hover:shadow-lg hover:scale-105 transition"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className="relative flex items-center justify-center">
        <img src={Teleport} alt="desk" />
        <div className="absolute text-center text-[#5C0EA4] font-inter text-xs font-normal leading-[0.9rem]">
          Click or hover to teleport
        </div>
      </div>
      
    </div>
  );
};

export default TeleportButton;