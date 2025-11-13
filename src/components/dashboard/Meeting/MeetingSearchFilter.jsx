import React from "react";
import { Search } from "lucide-react";
import down from "../../../assets/purpledown.svg";
import filter from "../../../assets/filter.svg";    
const MeetingSearchFilter = ({ searchTerm = "", onSearchChange }) => {
  return (
    <div className="flex flex-row gap-1 w-full sm:gap-3 items-center justify-between px-2 py-1  mb-2 sm:px-4 ">
      {/* Search Input */}
      <div className="flex items-center flex-1 border border-[#AC92CB] rounded-2xl p-2.5 ">
       
        <input
          type="text"
          placeholder="Search for meetings"
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 "
        /> 
        <Search className="text-gray-400 w-4 h-4 mr-2" />
      </div>

      {/* Filter Button */}
      <button className="flex items-center gap-1 sm:gap-4 border border-gray-300 text-gray-600 text-sm px-2.5 py-2.5 rounded-full ml-4 hover:bg-gray-50 transition">
        <img src={filter} alt="Filter" className="w-4 h-4" />
        <span>Filter</span>
        <img src={down} alt="Dropdown" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MeetingSearchFilter;
