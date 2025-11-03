import React from "react";
import searchIcon from "../../assets/dashsearch.svg";

const SearchSection = () => (
  <div className="relative z-10">
    <h2 className="text-2xl font-semibold mb-6 text-[#0E1219]">Search</h2>
    <div className="relative max-w-md">
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#6B7280]"
      />
      <img
        src={searchIcon}
        alt="search"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50"
      />
    </div>
  </div>
);

export default SearchSection;
