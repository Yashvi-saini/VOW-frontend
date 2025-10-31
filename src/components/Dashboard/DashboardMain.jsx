import React from "react";
import dashboardBg from "../../assets/dashboardbg.svg";
import keyIcon from "../../assets/Key.svg";


const DashboardMain = () => (
  <div>
     <div 
            className="absolute bottom-0 left-10 right-0 h-[532px] w-[1280px] bg-no-repeat bg-center bg-cover opacity-0.8"
            style={{ backgroundImage: `url(${dashboardBg})` }}
          ></div>


    <div className="relative z-10">
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-[#EFE7F6] rounded-xl p-6 border border-[#8F7AA9] flex flex-col items-center justify-center text-center gap-4 min-h-[185px]">
          <div>
            <h3 className="font-bold mb-[1px] text-[24px] text-[#000]">Workspace name</h3>
            <p className="text-[16px] text-[#000] mb-2">Recent activity: 6 hours ago</p>
          </div>
          <button className="bg-[#5E9BFF] text-white px-6 py-2 rounded-lg hover:bg-[#4A8CE0] transition font-normal text-[20px] border border-[#1F2937] w-[158px] h-[44px]">
            Enter office
          </button>
        </div>

        <div className="bg-[#EFE7F6] rounded-xl p-6 border border-[#8F7AA9] flex flex-col items-center justify-center text-center gap-4 min-h-[185px]">
          <div>
            <h3 className="font-bold mb-2 text-[24px] text-[#000]">Create Workspace</h3>
          </div>
          <button className="bg-[#5E9BFF] text-white px-6 py-2 rounded-lg hover:bg-[#4A8CE0] transition font-normal text-[20px] border border-[#1F2937] w-[112px] h-[44px]">
            Create
          </button>
        </div>

        <div className="bg-[#EFE7F6] rounded-xl p-6 border border-[#8F7AA9] flex flex-col items-center justify-center text-center gap-4 min-h-[185px]">
          <div className="w-full max-w-xs">
            <h3 className="font-bold mb-3 text-[24px] text-[#000] text-center">Join New Workspace</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter the Workspace Id to join"
                className="border bg-[#FFFFFF] border-[#707070] rounded-lg pl-3 pr-10 py-2 w-full text-sm focus:outline-none focus:border-[#5E9BFF] text-[#0E1219] placeholder:text-[#707070]"
              />
              <img
                src={keyIcon}
                alt="key"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60"
              />
            </div>
          </div>
          <button className="bg-[#5E9BFF] text-white px-6 py-2 rounded-lg hover:bg-[#4A8CE0] transition font-normal text-[20px] border border-[#1F2937] w-[88px] h-[44px]">
            Join
          </button>
        </div>
      </div>

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
