import React from "react";
import keyIcon from "../../assets/Key.svg";

const DashboardNewUser = () => {
  const card =
    "rounded-[16px] border border-[#8F7AA9] bg-[#EFE7F6]  p-6 flex flex-col items-center text-center gap-4 min-h-[200px]";
  const primaryBtn =
    "bg-[#5E9BFF] hover:bg-[#4A8CE0] text-white px-6 py-2.5 rounded-lg transition border border-[#1F2937]";
  const secondaryBtn =
    "bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#000] px-6 py-2.5 rounded-lg transition border border-[#1F2937]";

  return (
    <div className="relative">
      <div className="relative z-10">     
        <div className="mx-[88px] max-w-[944px] flex flex-col gap-10">         
          <div className="grid grid-cols-2 gap-10">
            <div className={card}>
              <h3 className="font-bold text-[24px] text-[#000]">Create Workspace</h3>
              <p className="text-[16px] text-[#000] opacity-80">
                Perfect for new teams or fresh projects.
              </p>
              <button className={primaryBtn}>Create</button>
            </div>

            {/* Join Workspace */}
            <div className={card}>
              <h3 className="font-bold text-[24px] text-[#000]">Join New Workspace</h3>
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Enter the Workspace ID to join"
                  className="w-full h-10 rounded-lg border border-[#707070] bg-white pl-3 pr-10 text-sm text-[#0E1219] placeholder:text-[#707070] focus:outline-none focus:border-[#5E9BFF]"
                />
                <img
                  src={keyIcon}
                  alt="key"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60"
                />
              </div>
              <button className={primaryBtn}>Join Now</button>
            </div>
          </div>

          {/* Tutorial card */}
          <div className="rounded-[16px] ">
            <div className="w-full h-[280px] rounded-[12px] bg-[#9FA3A9] flex items-center justify-center text-[#000]">
             
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-[#000] text-[16px] leading-6">
                New to Vow? Watch a short video to learn how to create spaces, invite your team,
                and get the most out of your workspace.
              </p>
              <div className="flex gap-4">
                <button className={`${primaryBtn} leading-[18px]`}>
                  Watch
                  <br />
                  Now
                </button>
                <button className={secondaryBtn}>Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewUser;

