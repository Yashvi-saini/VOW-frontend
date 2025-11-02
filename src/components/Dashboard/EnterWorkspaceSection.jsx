import React from "react";

const EnterWorkspaceSection = () => (
  <div className="relative z-10">
    <h2 className="text-2xl font-semibold mb-6 text-[#0E1219]">Enter Workspace</h2>
    <div className="max-w-md">
      <input
        type="text"
        placeholder="Enter Workspace ID"
        className="border border-gray-300 bg-[#EFE7F6] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#6B7280]"
      />
      <button className="bg-[#5E9BFF] text-white px-8 py-3 rounded-lg mt-4 hover:bg-[#4A8CE0] transition font-medium">
        Enter
      </button>
    </div>
  </div>
);

export default EnterWorkspaceSection;
