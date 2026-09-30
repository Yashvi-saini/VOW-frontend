import React from "react";
import { Search } from "lucide-react";
import down from "@/assets/purpledown.svg";
import filter from "@/assets/Filter.svg";    
const MeetingSearchFilter = ({ searchTerm = "", onSearchChange }) => {
  return (
    <div className="flex flex-row gap-1 w-full sm:gap-3 items-center justify-between px-2 py-1  mb-2 sm:px-4 ">
      
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

    </div>
  );
};

export default MeetingSearchFilter;
