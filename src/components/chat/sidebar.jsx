import React from "react";
import person from "../../assets/account_circle.svg";
import attherate from "../../assets/At sign.svg";
import group from "../../assets/groups.svg";
import space from "../../assets/space.svg";
import today from "../../assets/today.svg";
import TeamSection from "../chat/TeamSection.jsx";
const Sidebar = ({ onChannelSelect, onCreateTeam }) => {
  return (
    <aside className="w-64 bg-[#200539] border-r border-[#BCBCBC] p-4 pr-5 overflow-y-scroll">
      <h2 className="text-xl font-bold text-white mb-6">VOW</h2>

      {/* Main Nav */}
      <nav className="space-y-4 text-xl font-normal">
        <div className="text-white flex gap-1">
          <img src={person} alt="" />
          Dashboard
        </div>
        <div className="text-white flex gap-2">
          <img src={space} alt="" />
          Virtual Space
        </div>
        <div className="text-white flex gap-1">
          <img src={attherate} alt="" />
          Mentions
        </div>
        <div className="text-white flex gap-1">
          <img src={today} alt="" />
          Events
        </div>
        <div className="text-white flex gap-1">
          <img src={group} alt="" />
          Teams
        </div>
      </nav>

      {/* Team Sections */}
      <TeamSection title="Team" teams={[1, 2, 3, 4]} />
      <TeamSection title="Another Team" teams={[1, 2, 3, 4]} />
    </aside>
  );
};

export default Sidebar;
