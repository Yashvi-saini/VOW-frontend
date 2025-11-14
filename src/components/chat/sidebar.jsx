import React, { useState } from "react";
import person from "../../assets/person.svg";
import dashevents from "../../assets/dashevents.svg";
import videocam from "../../assets/videocam.svg";
import chat from "../../assets/chat.svg";
import logo from "../../assets/logo.png";
import settingsIcon from "../../assets/settings.svg";
import TeamSection from "../chat/TeamSection.jsx";
import MembersSection from "../chat/MembersSection.jsx";
import { useNavigate } from "react-router-dom";
const Sidebar = ({
  onChannelSelect,
  onCreateTeam,
  onCreateMeeting,
  onVirtualSpaceClick,
  onChatClick,
  onVideoConferenceClick,
  onShowMap, // optional legacy prop
}) => {
  const [active, setActive] = useState('virtual');

  const baseBtnClass =
    'w-full flex items-center gap-3 px-3 h-11 text-white rounded-lg text-left hover:bg-[#3D1B5F]';

  const collectRooms = () => {
    try {
      if (typeof window !== 'undefined' && typeof window.getMapRooms === 'function') {
        const ids = window.getMapRooms(true); // include corridor
        console.log('[sidebar] collected rooms via helper:', ids);
        return ids;
      }
      const nodes = document.querySelectorAll('[data-room-id]');
      const ids = Array.from(nodes)
        .map((n) => n.getAttribute('data-room-id'))
        .filter(Boolean);
      console.log('[sidebar] collected rooms via query:', ids);
      return ids;
    } catch (e) {
      console.error('[sidebar] collectRooms failed', e);
      return [];
    }
  };
const navigate = useNavigate();
  const postLayout = async (rooms) => {
    const payload = {
      name: 'Office Layout - Ground Floor',
      layoutUrl:
        'https://w7.pngwing.com/pngs/279/877/png-transparent-hyperlink-computer-icons-link-text-logo-number-thumbnail.png',
      rooms,
      metadata: { floor: 1, department: 'Engineering' },
    };
    console.log('[sidebar] posting layout payload:', payload);
    try {
      if (typeof createLayoutApi === 'function') {
        const res = await createLayoutApi(payload);
        console.log('[sidebar] layout created (api module):', res?.data ?? res);
      } else {
        const res = await fetch('https://vow-org.me/maps', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: payload.name,
            layoutUrl: payload.layoutUrl,
            rooms: payload.rooms,
          }),
        });
        const data = await res.json().catch(() => ({}));
        console.log('[sidebar] layout created (fetch fallback):', data);
      }
    } catch (err) {
      console.error('[sidebar] layout create failed:', err?.response?.data ?? err);
    }
  };

  const handleVirtualSpaceClick = async () => {
    setActive('virtual');
    // Show the map in the main view
    onVirtualSpaceClick?.();
    onShowMap?.();
    // Wait for the map to mount/update before collecting rooms
    await new Promise((resolve) =>
      requestAnimationFrame(() => setTimeout(resolve, 0))
    );
    const rooms = collectRooms();
    if (rooms.length) {
      await postLayout(rooms);
    } else {
      console.warn('[sidebar] no rooms found to post');
    }
  };

  const handleCreateMeetingClick = () => {
    setActive('createMeeting');
    onCreateMeeting?.();
  };

  const handleVideoConferenceClick = () => {
    setActive('video');
    onVideoConferenceClick?.();
  };

  const handleChatClick = () => {
    setActive('chat');
    onChatClick?.();
  };

  return (
    <aside className="max-w-[320px] max-h-[900x] h-screen bg-[#200539] border-r border-[#3D1B5F] overflow-hidden flex flex-col">
      {/* Header */}
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

      {/* Navigation */}
      <div className="px-6 py-4 overflow-y-auto flex-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.scrollbar-hide::-webkit-scrollbar{display:none;}`}</style>
        <nav className="space-y-2 mb-5">
          <button
            onClick={handleVirtualSpaceClick}
            className={`${baseBtnClass} ${
              active === 'virtual' ? 'bg-[#5C0EA4]' : 'bg-transparent'
            }`}
          >
            <img src={person} alt="" className="w-5 h-5" />
            <span className="text-base">Virtual Space</span>
          </button>

          <button
            onClick={handleCreateMeetingClick}
            className={`${baseBtnClass} ${
              active === 'createMeeting' ? 'bg-[#5C0EA4]' : 'bg-transparent'
            }`}
          >
            <img src={dashevents} alt="" className="w-5 h-5" />
            <span className="text-base">Create meeting</span>
          </button>

          <button
            onClick={handleVideoConferenceClick}
            className={`${baseBtnClass} ${
              active === 'video' ? 'bg-[#5C0EA4]' : 'bg-transparent'
            }`}
          >
            <img src={videocam} alt="" className="w-5 h-5" />
            <span className="text-base">Video Conference</span>
          </button>

          <button
            onClick={handleChatClick}
            className={`${baseBtnClass} ${
              active === 'chat' ? 'bg-[#5C0EA4]' : 'bg-transparent'
            }`}
          >
            <img src={chat} alt="" className="w-5 h-5" />
            <span className="text-base">Chat Room</span>
          </button>
        </nav>
        <TeamSection title="Team" onChannelSelect={onChannelSelect} />
        <MembersSection onSelectChannel={onChannelSelect} onOpenChat={onChatClick} />
      </div>

      {/* Settings at bottom */}
      <div className="px-6 py-4 border-t border-[#3D1B5F]">
        <button className="w-full flex items-center gap-3 px-3 h-11 text-white hover:bg-[#3D1B5F] rounded-lg text-left">
          <img src={settingsIcon} alt="settings" className="w-5 h-5" />
          <span className="text-base">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;