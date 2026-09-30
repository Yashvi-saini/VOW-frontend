import React from "react";

const MeetingHeader = () => {
  return (
    <div className="grid grid-cols-5 bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-t-lg">
      <div>Meeting Title</div>
      <div className="hidden sm:block">Date</div>
      <div className="hidden sm:block">Time</div>
      <div className="hidden sm:block">Organiser</div>
      <div className="hidden sm:block">Actions</div>
    </div>
  );
};

export default MeetingHeader;
