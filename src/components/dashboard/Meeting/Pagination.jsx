import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = () => {
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-2">
      <div className="flex justify-center items-center gap-1 sm:gap-5 bg-[#F5F1FB] rounded-lg px-2 sm:px-4 py-2 shadow-sm text-sm">
        {/* First & Prev */}
        <button className="sm:px-4 sm:py-2.5 px-1 py-1 hover:bg-gray-100 rounded-lg bg-white">
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button className="sm:px-4 sm:py-2.5 px-1 py-1 hover:bg-gray-100 rounded-lg bg-white">
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            className={`sm:px-4 sm:py-2.5 px-2 py-1 rounded-lg ${
              n === 2
                ? "bg-purple-600 text-white font-medium"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {n}
          </button>
        ))}

        <span className="px-2">...</span>
        <button className="sm:px-4 sm:py-2.5 px-2 py-1 rounded-lg bg-white hover:bg-gray-100">10</button>

        {/* Next & Last */}
        <button className="sm:px-4 sm:py-2.5 px-1 py-1 hover:bg-gray-100 rounded-lg bg-white">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className="sm:px-4 sm:py-2.5 px-1 py-1 hover:bg-gray-100 rounded-lg bg-white">
          <ChevronsRight className="w-4 h-4" />
        </button>

        {/* Page Selector */}
        <div className="ml-2 flex items-center gap-1 text-gray-700">
          <span>Page</span>
          <select className="border border-gray-400 rounded-md px-1 sm:px-2 py-1 text-sm outline-none bg-white" >
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
