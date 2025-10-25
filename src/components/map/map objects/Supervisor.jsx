// src/components/map/map objects/ManagerCabin.jsx
import React from "react";
import desk2 from "../map assets/desk2.svg";
const ManagerCabin = ({ x, y, width, height, title }) => {
  return (
    <div
      className="absolute bg-[#FFF] border-1 border-[#A8C2ED] border-dashed flex items-center justify-center"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div>
               <img src={desk2} alt="desk ml-[78px] mt-[78px] mb-[71px] mr-[82px]" />
            </div>
    </div>
  );
};

export default ManagerCabin;
