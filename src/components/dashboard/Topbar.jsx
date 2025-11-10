import React from "react";
import searchIcon from "../../assets/dashsearch.svg";
import { useSelector } from "react-redux";

// Accept a dynamic title from parent; fallback to Dashboard
const TopBar = ({ title = "Dashboard" }) => {
  const profile = useSelector((state) => state.user.profile);
  const { fullName, username } = profile || {};
  return (
    <header className="bg-[#240A44] text-white px-4.5 py-3.5 flex justify-between items-center">
    <div>  <span className="text-[26px] font-medium">Welcome back,</span>
      <span className="text-[26px] text-[#BFA2E1] font-medium"> {fullName || username || "Guest"}</span>
      </div>
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for people, workspace or files"
            className="  rounded-lg px-4 py-2 w-105 border-2 border-[#9982B4] text-sm text-[#9982B4]"
          />
          <img
            src={searchIcon}
            alt="search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;