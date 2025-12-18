import React from "react";
import rotatedarrow from "../../assets/rotatedarrow.svg";
import RejoinAndFetch from "./rejoinandfetch.jsx";
import UpcomingEvents from "./dash-components/upcomingevents.jsx";

const DashboardMain = ({ refreshTrigger }) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] w-full max-w-full bg-transparent overflow-x-hidden">
      {/* Header Section (Welcome / Rejoin Section) */}
      <div className="relative z-10 w-full px-4 lg:px-10">
        <RejoinAndFetch refreshTrigger={refreshTrigger} />
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
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
