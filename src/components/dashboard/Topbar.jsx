import React from "react";
import searchIcon from "../../assets/dashsearch.svg";
import { useSelector } from "react-redux";

// Accept a dynamic title from parent; fallback to Dashboard
const TopBar = ({ title = "Dashboard" }) => {
  const profile = useSelector((state) => state.user.profile);
  const { fullName, username } = profile || {};
  return (
    <header className="bg-[#240A44] text-white px-4 py-4 flex justify-between items-center">
      <div className="flex flex-col">
        <span className="text-[24px] font-medium leading-7 capitalize">{title}</span>
        
      </div>
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for people, workspace or files"
            className="bg-[#200539] text-[#9982B4] rounded-lg px-4 py-2 w-96 border border-[#9982B4] text-sm"
          />
          <img
            src={searchIcon}
            alt="search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;