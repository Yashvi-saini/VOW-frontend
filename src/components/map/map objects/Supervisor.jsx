import React from "react";
import desk2 from "../map assets/desk2.svg";
const ManagerCabin = ({ x, y, width, height, title }) => {
  return (
    <div
      className="absolute bg-[#FFF] border-1 border-[#A8C2ED] border-dashed flex items-center justify-center rounded-lg"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div>
               <img src={desk2} alt="desk" />
            </div>
    </div>
  );
};

export default ManagerCabin;
