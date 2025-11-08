import React, { useState } from "react";
import person from "../../assets/person.svg";
import dashevents from "../../assets/dashevents.svg";
import videocam from "../../assets/videocam.svg";
import chat from "../../assets/chat.svg";
import logo from "../../assets/logo.png";
import settingsIcon from "../../assets/settings.svg";
import TeamSection from "../chat/TeamSection.jsx";
import { useNavigate } from "react-router-dom";


const Sidebar = ({ onChannelSelect, onCreateTeam }) => {
  const navigate = useNavigate(); 
  sessionStorage.setItem("allowMap", "true");
  const handleVirtualSpaceClick = () => {
    // set session flag so FlowProtectedRoute allows access
   
    navigate("/map");
    
  };
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
          <span className="cursor-pointer" onClick={handleVirtualSpaceClick}>
            Virtual Space
          </span>
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
  <TeamSection title="Team" onChannelSelect={onChannelSelect} />
  <TeamSection title="Another Team" onChannelSelect={onChannelSelect} />
    </aside>
  );
};

export default Sidebar;