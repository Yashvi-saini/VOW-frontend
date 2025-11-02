import React from "react";

const CreateWorkspace = () => (
  <div className="relative z-10 ml-[71px]">
    <div className="max-w-lg space-y-6">
      <h2 className="text-[36px] font-bold mb-6 text-[#000]">Create a New Workspace</h2>
      <div>
        <label className="block text-[24px] font-semibold mb-2 text-[#000]">Workspace Name</label>
        <input
          type="text"
          placeholder="e.g. Design Studio, Growth Team, Marketing Hub"
          className="border border-[#707070] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#707070] bg-[#EFE7F6] font-normal"
        />
      </div>

      <div>
        <label className="block font-semibold border-[#707070] text-[24px] mb-2 text-[#000]">Choose Workspace Logo</label>
        <div className="flex items-center gap-4">
          <button className="text-xl font-bold text-[#5E9BFF] hover:text-[#4A8CE0]">{"<"}</button>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-12 h-12 rounded-full bg-gray-300 hover:bg-[#5E9BFF] cursor-pointer transition-all"></div>
            ))}
          <button className="text-xl font-bold text-[#5E9BFF] hover:text-[#4A8CE0]">{">"}</button>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2 text-[#000] text-[24px]">Total Members</label>
        <div className="flex gap-3 bg-[#EFE7F6] border-[#707070] ">
          <button className="border border-gray-300 px-4 py-2 rounded-lg  hover:bg-[#FFF] transition text-[#6B7280]">{"<20"}</button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-[#FFF] transition text-[#6B7280]">21–40</button>
          <button className="bg-[#5E9BFF] text-white px-4 py-2 rounded-lg ">41–60</button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg  hover:bg-[#FFF] transition text-[#6B7280]">61–80</button>
        </div>
      </div>

      <button className="bg-[#5E9BFF] text-white px-8 py-3 rounded-lg mt-6 hover:bg-[#4A8CE0] transition font-medium">
        Create Workspace
      </button>
    </div>
  </div>
);

export default CreateWorkspace;
