import React, { useState, useRef, useEffect } from "react";

import { useSelector } from "react-redux";

const TopBar = ({ title = "Dashboard", onMenuClick }) => {
  const profile = useSelector((state) => state.user.profile);
  const { fullName, username } = profile || {};

 // the icon button

  // Close when clicking outside


  return (
    <header className="bg-[#240A44] text-white px-4.5 py-3.5 flex flex-col lg:flex-row lg:justify-between lg:items-center relative z-20 w-full max-w-full">
      <div className="flex items-center justify-between w-full lg:w-auto min-w-0">
        
        {/* Hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex flex-col gap-1 p-2 mr-3"
          aria-label="Toggle menu"
        >
          <span className="w-6 h-0.5 bg-white rounded" />
          <span className="w-6 h-0.5 bg-white rounded" />
          <span className="w-6 h-0.5 bg-white rounded" />
        </button>

        {/* Welcome text */}
        <div className="flex-1 lg:flex-none min-w-0 overflow-hidden">
          <span className="text-lg sm:text-xl lg:text-[26px] font-medium">
            Welcome back,
          </span>
          <span className="text-lg sm:text-xl lg:text-[26px] text-[#BFA2E1] font-medium truncate">
            {" "}
            {fullName || username || "Guest"}
          </span>
        </div>
      </div>  
    </header>
  );
};

export default TopBar;
