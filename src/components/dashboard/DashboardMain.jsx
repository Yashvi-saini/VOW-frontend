import React from "react";
import rotatedarrow from "../../assets/rotatedarrow.svg";
import RejoinAndFetch from "./rejoinandfetch.jsx";
import UpcomingEvents from "./dash-components/upcomingevents.jsx";
const DashboardMain = () => (
  <div>
    <div className="relative z-10">
     <RejoinAndFetch /> 

      <div className="flex justify-between mx-15  ">
        
        <UpcomingEvents />

        <div className=" rounded-xl  ml-13 border border-none flex flex-col w-[450px] min-h-[350px]">
          <div className="flex  justify-between p-5 bg-[radial-gradient(circle_at_center,_rgba(239,230,246,1)_40%,_rgba(225,208,238,0.9)_70%)] rounded-2xl w-full">
          <div className="text-2xl">
            <h3>File Shared Today</h3>
            <p>12</p>
          </div>
          <div>
            <img src={rotatedarrow} alt="rotated arrow" className="w-5" />
          </div>
      </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardMain;
