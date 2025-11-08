import React from "react";
import person from "../../assets/person.svg";
import dashevents from "../../assets/dashevents.svg";
import videocam from "../../assets/videocam.svg";
import chat from "../../assets/chat.svg";
import logo from "../../assets/logo.png";
import settingsIcon from "../../assets/settings.svg";
import TeamSection from "../chat/TeamSection.jsx";
import MembersSection from "../chat/MembersSection.jsx";

const Sidebar = ({ onChannelSelect, onCreateTeam, onCreateMeeting, onVirtualSpaceClick, onChatClick, onVideoConferenceClick }) => {
  const handleVirtualSpaceClick = () => {
    if (onVirtualSpaceClick) {
      onVirtualSpaceClick();
    }
  };

  const handleVideoConferenceClick = () => {
    if (onVideoConferenceClick) {
      onVideoConferenceClick();
    }
  };

  return (
  <aside className="w-[320px] h-screen bg-[#200539] border-r border-[#3D1B5F] overflow-hidden flex flex-col">
      {/* Header */}
  <div className="px-6 py-4 border-b border-[#3D1B5F]">
        <div className="flex items-center gap-2">
          <img src={logo} alt="VOW Logo" className="w-8 h-8" />
          <h2 className="text-xl font-bold text-white tracking-wide">VOW</h2>
        </div>
      </div>

      {/* Scrollable Content - hidden scrollbar */}
  <div className="flex-1 overflow-y-auto px-6 py-3 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Main Nav */}
        <nav className="space-y-2 mb-5">
          <button
            onClick={handleVirtualSpaceClick}
            className="w-full flex items-center gap-3 px-3 h-11 text-white rounded-lg text-left bg-[#5C0EA4]"
          >
            <img src={person} alt="" className="w-5 h-5" />
            <span className="text-base">Virtual Space</span>
          </button>

          <button
            onClick={onCreateMeeting}
            className="w-full flex items-center gap-3 px-3 h-11 text-white hover:bg-[#3D1B5F] rounded-lg text-left"
          >
            <img src={dashevents} alt="" className="w-5 h-5" />
            <span className="text-base">Create meeting</span>
          </button>

          <button
            onClick={handleVideoConferenceClick}
            className="w-full flex items-center gap-3 px-3 h-11 text-white hover:bg-[#3D1B5F] rounded-lg text-left"
          >
            <img src={videocam} alt="" className="w-5 h-5" />
            <span className="text-base">Video Conference</span>
          </button>

          <button
            onClick={onChatClick}
            className="w-full flex items-center gap-3 px-3 h-11 text-white hover:bg-[#3D1B5F] rounded-lg text-left"
          >
            <img src={chat} alt="" className="w-5 h-5" />
            <span className="text-base">Chat Room</span>
          </button>
        </nav>

    {/* Team Sections */}
  <TeamSection title="Team" onChannelSelect={onChannelSelect} />
  <MembersSection onSelectChannel={onChannelSelect} onOpenChat={onChatClick} />
      </div>

      {/* Settings at bottom */}
      <div className="px-6 py-4 border-t border-[#3D1B5F] mt-auto">
        <button className="w-full flex items-center gap-3 px-3 h-11 text-white hover:bg-[#3D1B5F] rounded-lg text-left">
          <img src={settingsIcon} alt="settings" className="w-5 h-5" />
          <span className="text-base">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
