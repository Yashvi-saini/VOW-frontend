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

        <div className=" rounded-xl  ml-13 border border-none flex flex-col w-[450px] min-h-[350px] justify-between gap-3">
 <div className="flex  justify-between py-6 px-8  bg-[radial-gradient(circle_at_center,_rgba(239,230,246,1)_40%,_rgba(225,208,238,0.9)_70%)] hover:bg-gradient-to-b from-[#5C0EA4] to-[#8347BB] hover:text-white rounded-2xl w-full ">
          <div className="text-[20px]">
            <h3>File Shared Today</h3>
            <p className="text-[40px] font-semibold">12</p>
          </div>
          <div className="flex flex-col justify-center ">
            <div className="w-12 h-12 p-2 flex justify-center items-center bg-white rounded-lg">
            <img src={rotatedarrow} alt="rotated arrow" className=" w-4 h-4 " />
          </div>
          </div>
          </div>
    <div className="flex  justify-between py-6 px-8  bg-[radial-gradient(circle_at_center,_rgba(239,230,246,1)_40%,_rgba(225,208,238,0.9)_70%)] hover:bg-gradient-to-b from-[#5C0EA4] to-[#8347BB] hover:text-white rounded-2xl w-full ">
          <div className="text-[20px]">
            <h3>Unread messages</h3>
            <p className="text-[40px] font-semibold">12</p>
          </div>
          <div className="flex flex-col justify-center ">
            <div className="w-12 h-12 p-2 flex justify-center items-center bg-white rounded-lg">
            <img src={rotatedarrow} alt="rotated arrow" className=" w-4 h-4 " />
          </div>
          </div>
          </div>
          <div className="flex  justify-between py-6 px-8  bg-[radial-gradient(circle_at_center,_rgba(239,230,246,1)_40%,_rgba(225,208,238,0.9)_70%)] hover:bg-gradient-to-b from-[#5C0EA4] to-[#8347BB] hover:text-white rounded-2xl w-full">
          <div className="text-[20px]">
            <h3>Time Spent</h3>
            <p className="text-[40px] font-semibold">3 hr 30 min</p>
          </div>
          <div className="flex flex-col justify-center ">
            <div className="w-12 h-12 p-2 flex justify-center items-center bg-white rounded-lg">
            <img src={rotatedarrow} alt="rotated arrow" className=" w-4 h-4 " />
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardMain;
