import React from "react";

import RejoinAndFetch from "../Dashboard/rejoinandfetch.jsx";

const DashboardMain = () => (
  <div>
    <div className="relative z-10">
     <RejoinAndFetch /> 

      <div className="grid grid-cols-2 gap-6 ">
        <div className="bg-[#EFE7F6] rounded-xl p-6 shadow-sm border border-[#8F7AA9] flex flex-col min-h-[350px]">
          <h4 className="font-bold mb-4 text-[24px] text-[#000]">Upcoming Events</h4>
          <div className="flex items-center justify-between mb-4">
            <button className="text-[#5E9BFF] hover:text-[#4A8CE0] font-medium text-sm">Previous</button>
            <span className="font-medium text-[#0E1219] text-sm">November 2025</span>
            <button className="text-[#5E9BFF] hover:text-[#4A8CE0] font-medium text-sm">Next</button>
          </div>
          <div className="space-y-3 flex-grow">
            <div className="bg-[#5C0EA4] text-white p-4 rounded-lg">
              <p className="text-sm font-medium">Event Title</p>
              <p className="text-xs opacity-90">09:00-09:45 AM IST</p>
            </div>
            <div className="border border-[#BCBCBC] p-4 rounded-lg bg-[#E9EAEB]">
              <p className="text-sm font-medium text-[#0E1219]">Event Title</p>
              <p className="text-xs text-[#6B7280]">09:00-09:45 AM IST</p>
            </div>
          </div>
        </div>

        <div className="bg-[#EFE7F6] rounded-xl p-6 shadow-sm border border-[#8F7AA9] flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-[24px] text-[#000]">Recent Chats</h4>
            <span className="text-sm text-[#6B7280]">5 unread messages</span>
          </div>
          <div className="space-y-3 flex-grow">
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#EFE7F6] rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#5E9BFF] rounded-full "></div>
                    <div>
                      <p className="font-medium text-[20px] text-[#000]">Workspace name</p>
                      <p className="text-[16px] text-[#000]">Fullname: Text Message</p>
                    </div>
                  </div>
                  <button className="text-[#5E9BFF] hover:text-[#4A8CE0] text-sm font-medium">→</button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardMain;
