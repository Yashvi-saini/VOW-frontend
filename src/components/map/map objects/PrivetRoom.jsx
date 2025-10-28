import React from "react";
import privateroomdesk from "../map assets/privateroomdesk.svg";
const PrivateRoom = ({ x, y, width, height, title }) => {
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
      <div className="flex gap-[100px]">
               <img src={privateroomdesk} alt="desk" />
               <img src={privateroomdesk} alt="desk" />
               <img src={privateroomdesk} alt="desk" />
               <img src={privateroomdesk} alt="desk" />
     </div>
    </div>
  );
};

export default PrivateRoom;