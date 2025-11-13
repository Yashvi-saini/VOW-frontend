import React from "react";

const MeetingTabs = ({ total = 0, byManager = 0, bySupervisor = 0 }) => {
  return (
    <div className="flex gap-6 text-sm text-gray-700 mb-3 ml-2">
      <span className="font-medium text-gray-900">{total} Scheduled Meeting{total !== 1 ? 's' : ''}</span>
      <span>{byManager} By manager</span>
      <span>{bySupervisor} By supervisor</span>
    </div>
  );
};

export default MeetingTabs;
