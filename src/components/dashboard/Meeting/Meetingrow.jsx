import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import down from "../../../assets/purpledown.svg";
import calendarIcon from "../../../assets/today.svg";
import timeIcon from "../../../assets/today.svg";
import userIcon from "../../../assets/icon.svg";

const MeetingRow = ({ avatar, title, date, time, organiser, description, onDelete, meetingId }) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (deleting) return;
    
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setDeleting(true);
      try {
        await onDelete?.(meetingId);
      } catch (err) {
        console.error('Delete failed:', err);
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden mb-2">
      {/* Top row */}
      <div
        className="flex justify-between items-center px-4 py-3 sm:grid sm:grid-cols-5 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full" />
          <div>
            <div className="font-medium text-gray-800">{title}</div>
            <div className="text-gray-500 text-xs sm:hidden">{description}</div>
          </div>
        </div>

        {/* Desktop details */}
        <div className="text-gray-600 text-sm hidden sm:block">{date}</div>
        <div className="text-gray-600 text-sm hidden sm:block">{time}</div>
        <div className="text-gray-600 text-sm hidden sm:block">{organiser}</div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="ml-auto sm:ml-0 p-2 hover:bg-red-50 rounded-full transition disabled:opacity-50"
          title="Delete meeting"
        >
          <Trash2 className={`w-4 h-4 text-red-500 ${deleting ? 'animate-pulse' : ''}`} />
        </button>

        {/* Mobile dropdown arrow */}
        <img
          src={down}
          alt="expand"
          className={`w-4 h-4 sm:hidden transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown content for mobile */}
      {open && (
        <div className="sm:hidden bg-indigo-50 px-4 py-3 flex justify-between gap-2 animate-fadeIn">
          <div className="flex items-center text-sm text-gray-700 gap-2">
            <img src={calendarIcon} alt="calendar" className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700 gap-2">
            <img src={timeIcon} alt="time" className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-700 gap-2">
            <img src={userIcon} alt="user" className="w-4 h-4" />
            <span>{organiser}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRow;
