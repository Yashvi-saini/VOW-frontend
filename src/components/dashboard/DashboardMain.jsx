import React from "react";
import rotatedarrow from "../../assets/rotatedarrow.svg";
import RejoinAndFetch from "./rejoinandfetch.jsx";
import UpcomingEvents from "./dash-components/upcomingevents.jsx";

const DashboardMain = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] w-full max-w-full bg-transparent overflow-x-hidden">
      {/* Header Section (Welcome / Rejoin Section) */}
      <div className="relative z-10 w-full px-4 lg:px-10">
        <RejoinAndFetch />
      </div>

      {/* Main Content Section */}
      <div
        className="
          flex flex-col lg:flex-row 
          justify-between 
          gap-6 
          px-4 lg:px-10 
          py-6 
          w-full 
          max-w-full
          flex-1
          mb-15
          sm:mb-30
        "
      >
        {/* Upcoming Events Section */}
        <div className="w-full lg:w-[60%] flex-shrink-0">
          <UpcomingEvents/>
        </div>

        {/* Stats / Summary Cards */}
        {/* <div
          className="
            flex flex-row lg:flex-col
            w-full lg:w-[38%]
            gap-3 lg:gap-4
            rounded-xl 
            min-h-[100px]
          "
        > */}
          {/* Card 1 */}
          {/* <div
            className="
              flex flex-col justify-between
              py-4 px-4 lg:py-1 lg:pl-6 lg:pr-2
              gradient 
              bg-[#EFE7F6]
              hover:bg-gradient-to-b hover:from-[#5C0EA4] hover:to-[#8347BB] 
              hover:text-white 
              rounded-2xl 
              w-full 
              transition-all duration-300
              flex-1
            "
          >
            <div className="flex justify-end mb-2 ">
              <div className="w-8 h-8 p-1.5 flex  justify-center items-center bg-white rounded-lg">
                <img src={rotatedarrow} alt="rotated arrow" className="w-3 h-3" />
              </div>
            </div>
            <div className="text-[13px] lg:text-[15px]">
              <h3 className="font-medium">File Shared Today</h3>
              <p className="text-[24px] lg:text-[32px] font-semibold">12</p>
            </div>
          </div> */}

          {/* Card 2 */}
          {/* <div
            className="
              flex flex-col justify-between
           py-4 px-4 lg:py-1 lg:pl-6 lg:pr-2
              gradient 
              bg-[#EFE7F6]
              hover:bg-gradient-to-b hover:from-[#5C0EA4] hover:to-[#8347BB] 
              hover:text-white 
              rounded-2xl 
              w-full 
              transition-all duration-300
              flex-1
            "
          >
            <div className="flex justify-end mb-2">
              <div className="w-8 h-8 p-1.5 flex justify-center items-center bg-white rounded-lg">
                <img src={rotatedarrow} alt="rotated arrow" className="w-3 h-3" />
              </div>
            </div>
            <div className="text-[13px] lg:text-[15px]">
              <h3 className="font-medium">Unread Messages</h3>
              <p className="text-[24px] lg:text-[32px] font-semibold">12</p>
            </div>
          </div> */}

          {/* Card 3 */}
          {/* <div
            className="
              flex flex-col justify-between
              py-4 px-4 lg:py-5 lg:px-6
              gradient 
              hover:bg-gradient-to-b hover:from-[#5C0EA4] hover:to-[#8347BB] 
              hover:text-white 
              rounded-2xl 
              w-full 
              transition-all duration-300
              flex-1
            "
          >
            <div className="text-[13px] lg:text-[15px]">
              <h3 className="font-medium">Time Spent</h3>
              <p className="text-[24px] lg:text-[32px] font-semibold">3 hr 30 min</p>
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default DashboardMain;
