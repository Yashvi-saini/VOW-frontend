import { useState, useEffect } from "react";
import User from "../map assets/user.svg";
import LockOpen from "../map assets/lockopen.svg";
import LockClose from "../map assets/lock close.svg";
import Left from "../map assets/left.svg";
import Right from "../map assets/right.svg";

export default function ZoneButton({
  label = "Zone",
  numberOfUsers = 0,
  locked = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(locked);

  return (
    <div className="absolute bottom-0 left-0">
      <button
        data-map-no-move
        onMouseDown={(e) => e.stopPropagation()}
        className={`flex items-center justify-between gap-2 border border-[#385D99] bg-[#E7F0FF] py-2 px-2 rounded-lg shadow-sm `}
        
      >
        
        <span className="font-semibold text-[#385D99]">{label}</span>
        {isOpen ? (
          <div className="flex items-center gap-2">
            <img src={User} alt="Users" className="w-4 h-4 text-[#385D99]" />
            <span className="text-sm text-[#385D99]">{numberOfUsers}</span>
            <img
              src={isLocked ? LockClose : LockOpen}
              alt={isLocked ? "Locked" : "Unlocked"}
              className="w-4 h-4 text-gray-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsLocked(!isLocked);
              }}
            />
            <img
              src={Left}
              alt="Collapse"
              className="w-4 h-4 text-gray-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />
          </div>
        ) : (
          <img
            src={Right}
            alt="Expand"
            className="w-4 h-4 text-gray-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          />
        )}
      </button>
    </div>
  );
}
