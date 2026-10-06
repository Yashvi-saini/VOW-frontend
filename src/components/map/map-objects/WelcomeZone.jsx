import React from "react";
import Reception from "../map assets/Reception.svg";
import HelpDesk from "../map assets/HelpDesk.svg";
import ZoneButton from "../map-components/button.jsx"
const WelcomeZone = ({ x, y, width, height, title }) => {
  return (
    <div
      className="absolute bg-[#FFF] border-2 border-[#A8C2ED] border-dashed flex items-center justify-center rounded-lg gap-[6.25rem]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className="flex flex-col items-center ">
        <p className="font-semibold text-[#385D99] mb-1">Helpdesk</p>
        <img src={HelpDesk} alt="Helpdesk" className="w-[auto] h-[5rem]" />
      </div>
      <div className="relative flex items-center justify-center">
        <div className="bg-white border border-[#A8C2ED] border-dashed w-[20rem] h-[5rem] flex items-center justify-center rounded-lg ">
          <p className="font-semibold text-[#385D99]">Lobby</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="font-semibold text-[#385D99] mb-1">Reception</p>
        <img src={Reception} alt="Reception" className="w-[auto] h-[5rem]" />
      </div>
       <ZoneButton 
  label="Welcome Zone" 
  numberOfUsers={6} 
  locked={true} 
/>
    </div>
  );
};

export default WelcomeZone;