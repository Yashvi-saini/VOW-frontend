import React from "react";
import keyIcon from "../../assets/Key.svg";

 const CreateAndJoin = ({ onCreate }) => {
    return (
        <div className="grid grid-cols-2 gap-6 mb-8">
        
                <div className="bg-[#EFE7F6] rounded-xl p-6 border border-[#8F7AA9] flex flex-col items-center justify-center text-center gap-4 min-h-[185px]">
                  <div>
                    <h3 className="font-bold mb-2 text-[24px] text-[#000]">Create Workspace</h3>
                  </div>
                  <button className="bg-[#5E9BFF] text-white px-6 py-2 rounded-lg hover:bg-[#4A8CE0] transition font-normal text-[20px] border border-[#1F2937] w-[112px] h-[44px]" onClick={onCreate}>
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
    );
}
export default CreateAndJoin;