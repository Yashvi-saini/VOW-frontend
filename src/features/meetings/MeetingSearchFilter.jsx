import React from "react";
import { Search, Plus } from "lucide-react";

const MeetingSearchFilter = ({ searchTerm = "", onSearchChange, onScheduleClick }) => {
  return (
    <div className="flex flex-row gap-2 w-full sm:gap-3 items-center justify-between px-2 py-1 mb-2 sm:px-4">
      <div className="flex items-center flex-1 border border-[#AC92CB] rounded-2xl p-2.5 bg-white">
        <input
          type="text"
          placeholder="Search for meetings"
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
        /> 
        <Search className="text-gray-400 w-4 h-4 mr-2" />
      </div>

      {onScheduleClick && (
        <button
          onClick={onScheduleClick}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#5C0EA4] text-white text-sm font-medium hover:bg-[#480B80] transition shadow-sm whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Schedule Meeting
        </button>
      )}
    </div>
  );
};

export default MeetingSearchFilter;

