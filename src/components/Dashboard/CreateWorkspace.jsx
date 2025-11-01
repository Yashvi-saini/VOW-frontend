import React from "react";

const CreateWorkspace = () => (
  <div className="relative z-10">
    <div className="max-w-lg space-y-6">
      <h2 className="text-2xl font-semibold mb-6 text-[#0E1219]">Create a New Workspace</h2>
      <div>
        <label className="block font-medium mb-2 text-[#0E1219]">Workspace Name</label>
        <input
          type="text"
          placeholder="e.g. Design Studio, Growth Team, Marketing Hub"
          className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#6B7280]"
        />
      </div>

      <div>
        <label className="block font-medium mb-2 text-[#0E1219]">Choose Workspace Logo</label>
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
        <label className="block font-medium mb-2 text-[#0E1219]">Total Members</label>
        <div className="flex gap-3">
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:border-[#5E9BFF] hover:bg-[#5E9BFF]/10 transition text-[#6B7280]">{"<20"}</button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:border-[#5E9BFF] hover:bg-[#5E9BFF]/10 transition text-[#6B7280]">21–40</button>
          <button className="bg-[#5E9BFF] text-white px-4 py-2 rounded-lg hover:bg-[#4A8CE0] transition">41–60</button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:border-[#5E9BFF] hover:bg-[#5E9BFF]/10 transition text-[#6B7280]">61–80</button>
        </div>
      </div>

      <button className="bg-[#5E9BFF] text-white px-8 py-3 rounded-lg mt-6 hover:bg-[#4A8CE0] transition font-medium">
        Create Workspace
      </button>
    </div>
  </div>
);

export default CreateWorkspace;
