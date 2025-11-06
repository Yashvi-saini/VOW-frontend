import React from "react";
import searchIcon from "../../assets/dashsearch.svg";
import { useSelector } from "react-redux";

const TopBar = () => {
 const profile = useSelector((state) => state.user.profile);
 const { fullName, username } = profile || {};
  console.log("TopBar Redux state:", { fullName, username });
  return (
    <header className="bg-[#240A44] text-white px-4 py-4 flex justify-between items-center">
      <span className="text-[24px] font-medium">Welcome back, {fullName || username || "Guest"}</span>
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for people, workspace or files"
            className="bg-[#200539] text-[#9982B4] rounded-lg px-4 py-2 w-96 border-[1px] border-[#9982B4] text-sm"
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