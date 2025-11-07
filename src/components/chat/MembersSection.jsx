import React, { useState } from "react";
import down from "../../assets/down.svg";
import add from "../../assets/add.svg"; // reserved if later adding invite
import right from "../../assets/right arrow.svg";
import { useSelector } from "react-redux";
import { useMembers } from "../useMembers";

const MembersSection = () => {
  const { workspaceId } = useSelector((state) => state.user);
  const { members, loading, error, fetchMembers } = useMembers(workspaceId);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggle = () => setIsCollapsed((p) => !p);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-white bg-[#200539] py-2 px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={toggle}>
          <img
            src={isCollapsed ? right : down}
            alt="toggle arrow"
            className="mt-2.5 w-6 transition-transform"
          />
          <h3 className="text-xl">Members</h3>
        </div>
        <button
          type="button"
          onClick={fetchMembers}
          className="text-xs bg-[#BFA2E1] text-[#0E1219] px-2 py-1 rounded-md font-medium hover:opacity-90"
        >
          Refresh
        </button>
      </div>
      {!isCollapsed && (
        <div className="max-h-64 overflow-y-auto scrollbar-hide">
          <style>{`.scrollbar-hide{ -ms-overflow-style:none; scrollbar-width:none; }.scrollbar-hide::-webkit-scrollbar{display:none;}`}</style>
          {loading && (
            <p className="text-[#BCBCBC] text-sm px-4 py-2">Loading members…</p>
          )}
          {error && (
            <p className="text-red-400 text-sm px-4 py-2">Failed to load members</p>
          )}
            {members.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between text-white bg-[#200539] px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#2DB3FF]"></span>
                  <h4 className="text-[#BCBCBC] text-base">{m.fullName || m.username}</h4>
                </div>
                <span className="text-[12px] text-[#BCBCBC] bg-[#2F0A5C] px-2 py-0.5 rounded-md">{m.role || ""}</span>
              </div>
            ))}
            {(!loading && members.length === 0) && (
              <p className="text-[#BCBCBC] text-sm px-4 py-2">No members yet</p>
            )}
        </div>
      )}
    </div>
  );
};

export default MembersSection;
