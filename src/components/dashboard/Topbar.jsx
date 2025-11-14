import React, { useState, useRef, useEffect } from "react";
import searchIcon from "../../assets/dashsearch.svg";
import { useSelector } from "react-redux";

const TopBar = ({ title = "Dashboard", onMenuClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profile = useSelector((state) => state.user.profile);
  const { fullName, username } = profile || {};

  const searchBoxRef = useRef(null);    // search bar container
  const searchButtonRef = useRef(null); // the icon button

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isSearchOpen) return;

      const clickedOutside =
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(e.target);

      if (clickedOutside) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isSearchOpen]);

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

        {/* Search icon (mobile) */}
        
      </div>

      {/* Mobile Search Box */}
      {isSearchOpen && (
        <div ref={searchBoxRef} className="mt-3 lg:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for people, workspace or files"
              className="rounded-lg px-4 py-2 w-full border-2 border-[#9982B4] text-sm text-[#9982B4]"
              autoFocus
            />
            <img
              src={searchIcon}
              alt="search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50"
            />
          </div>
        </div>
      )}

      {/* Desktop Search Bar */}
      <div className="hidden lg:flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for people, workspace or files"
            className="rounded-lg px-4 py-2 w-105 border-2 border-[#9982B4] text-sm text-[#9982B4]"
          />
          <img
            src={searchIcon}
            alt="search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
