import React from "react";
import { createLayout } from "../../api/layoutApi";
import person from "../../assets/account_circle.svg";
import attherate from "../../assets/At sign.svg";
import group from "../../assets/groups.svg";
import space from "../../assets/space.svg";
import today from "../../assets/today.svg";
import TeamSection from "../chat/TeamSection.jsx";



const Sidebar = ({ onChannelSelect, onCreateTeam ,onShowMap}) => {

  sessionStorage.setItem("allowMap", "true");
 
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
          <span
            className="cursor-pointer"
            onClick={async () => {
              try {
                // Notify parent to show map
                onShowMap?.();
                // Wait a tick for the map to mount/update before collecting rooms
                await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
                // Prefer the map-provided helper to avoid timing issues
                let rooms = [];
                if (typeof window !== 'undefined' && typeof window.getMapRooms === 'function') {
                  rooms = window.getMapRooms(true); // include corridor
                } else {
                  const roomNodes = document.querySelectorAll('[data-room-id]');
                  rooms = Array.from(roomNodes)
                    .map(n => n.getAttribute('data-room-id'))
                    .filter(Boolean);
                }
                // Prepare payload (backend expects valid JSON + likely absolute layoutUrl)
                const payload = {
                  name: "Office Layout - Ground Floor",
                  // Use an absolute URL to avoid server rejecting relative paths
                  layoutUrl: "https://w7.pngwing.com/pngs/279/877/png-transparent-hyperlink-computer-icons-link-text-logo-number-thumbnail.png",
                  rooms,
                  metadata: { floor: 1, department: "Engineering" },
                };
                const res = await createLayout(payload);
                console.log("Layout created", res.data);
                // Optional UX: simple success message
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Layout created' } }));
                }
              } catch (e) {
                // Surface details
                const msg = e?.response?.data || e?.message || e;
                console.error("Failed to create layout", msg);
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: 'Failed to create layout' } }));
                }
              }
            }}
          >
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
         <div
          className="text-white flex gap-1 cursor-pointer"
          onClick={onCreateTeam}
        >
          <img src={group} alt="" />
          Create Team
        </div>

      </nav>

      {/* Team Sections */}
  <TeamSection title="Team" teams={[1, 2, 3, 4]} onChannelSelect={onChannelSelect} />
  <TeamSection title="Another Team" teams={[1, 2, 3, 4]} onChannelSelect={onChannelSelect} />
    </aside>
  );
};

export default Sidebar;
