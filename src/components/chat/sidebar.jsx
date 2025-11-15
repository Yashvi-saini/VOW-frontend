import React, { useState } from "react";
import person from "../../assets/person.svg";
import dashevents from "../../assets/dashevents.svg";
import videocam from "../../assets/videocam.svg";
import logo from "../../assets/logo.png";
import settingsIcon from "../../assets/settings.svg";
import ChatRoomSection from "../chat/ChatRoomSection.jsx";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  onChannelSelect,
  onCreateTeam,
  onCreateMeeting,
  onVirtualSpaceClick,
  onChatClick,
  onVideoConferenceClick,
  onShowMap,
  onStartDM,
  unreadDMs = {},
  onOpenMemberModal,   // ⭐ new callback to open MemberMultiSelect
}) => {
  const [active, setActive] = useState("virtual");
  const navigate = useNavigate();

  const baseBtnClass =
    "w-full flex items-center gap-3 px-3 h-11 text-white rounded-lg text-left hover:bg-[#3D1B5F]";

  const collectRooms = () => {
    try {
      if (typeof window !== "undefined" && typeof window.getMapRooms === "function") {
        return window.getMapRooms(true);
      }
      const nodes = document.querySelectorAll("[data-room-id]");
      return Array.from(nodes)
        .map((n) => n.getAttribute("data-room-id"))
        .filter(Boolean);
    } catch (e) {
      console.error("[sidebar] collectRooms failed", e);
      return [];
    }
  };

  const postLayout = async (rooms) => {
    try {
      const res = await fetch("https://vow-org.me/maps", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Office Layout - Ground Floor",
          layoutUrl:
            "https://w7.pngwing.com/pngs/279/877/png-transparent-hyperlink-computer-icons-link-text-logo-number-thumbnail.png",
          rooms,
        }),
      });

      console.log("[sidebar] layout api:", await res.json());
    } catch (err) {
      console.error("[sidebar] layout create failed:", err);
    }
  };

  const handleVirtualSpaceClick = async () => {
    setActive("virtual");
    onVirtualSpaceClick?.();
    onShowMap?.();

    await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

    const rooms = collectRooms();
    if (rooms.length) postLayout(rooms);
  };

  const handleCreateMeetingClick = () => {
    setActive("createMeeting");
    onCreateMeeting?.();
  };

  const handleVideoConferenceClick = () => {
    setActive("video");
    onVideoConferenceClick?.();
  };

  const handleChatClick = () => {
    setActive("chat");
    onChatClick?.();
  };

  return (
    <aside className="max-w-[320px] h-screen bg-[#200539] border-r border-[#3D1B5F] overflow-hidden flex flex-col">
      
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-[#3D1B5F]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <img src={logo} alt="VOW Logo" className="w-8 h-8" />
          <h2 className="text-xl font-bold text-white tracking-wide group-hover:opacity-80 transition">
            VOW
          </h2>
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="px-6 py-4 space-y-3">

        {/* Add Members */}
        {/* <button
          onClick={() => onOpenMemberModal("add")}
          className="w-full h-11 flex items-center justify-center gap-2 
                     bg-[#5E9BFF] text-white rounded-xl hover:bg-[#4A8AE8] transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Members
        </button> */}

        {/* Create Team */}
        <button
          onClick={() => onOpenMemberModal("team")}
          className="w-full h-11 flex items-center justify-center gap-2 
                     bg-[#5E9BFF] text-white rounded-xl hover:bg-[#4A8AE8] transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2
                 c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0
                 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857
                 m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0
                 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Create Team
        </button>
      </div>

      {/* NAVIGATION */}
      <div
        className="px-6 py-4 overflow-y-auto flex-1 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.scrollbar-hide::-webkit-scrollbar{display:none;}`}</style>

        <nav className="space-y-2">
          <button
            onClick={handleVirtualSpaceClick}
            className={`${baseBtnClass} ${active === "virtual" ? "bg-[#5C0EA4]" : "bg-transparent"}`}
          >
            <img src={person} alt="" className="w-5 h-5" />
            <span className="text-base">Virtual Space</span>
          </button>

          <button
            onClick={handleCreateMeetingClick}
            className={`${baseBtnClass} ${
              active === "createMeeting" ? "bg-[#5C0EA4]" : "bg-transparent"
            }`}
          >
            <img src={dashevents} alt="" className="w-5 h-5" />
            <span className="text-base">Create meeting</span>
          </button>

          <button
            onClick={handleVideoConferenceClick}
            className={`${baseBtnClass} ${
              active === "video" ? "bg-[#5C0EA4]" : "bg-transparent"
            }`}
          >
            <img src={videocam} alt="" className="w-5 h-5" />
            <span className="text-base">Video Conference</span>
          </button>
        </nav>

        <ChatRoomSection
          title="Chat Room"
          onChannelSelect={onChannelSelect}
          onStartDM={onStartDM}
          unreadDMs={unreadDMs}
        />
      </div>

      {/* SETTINGS */}
      {/* <div className="px-6 py-4 border-t border-[#3D1B5F]">
        <button className="w-full flex items-center gap-3 px-3 h-11 text-white hover:bg-[#3D1B5F] rounded-lg text-left">
          <img src={settingsIcon} alt="settings" className="w-5 h-5" />
          <span className="text-base">Settings</span>
        </button>
      </div> */}
    </aside>
  );
};

export default Sidebar;
