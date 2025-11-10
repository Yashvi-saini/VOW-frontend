import React from "react";
import logo from "../../assets/logo.svg";
import notificationIcon from "../../assets/dashnotify.svg";
import calendarIcon from "../../assets/today.svg";
import createIcon from "../../assets/dashcreate.svg";
import keyIcon from "../../assets/Key.svg";
import folderIcon from "../../assets/folder.svg";
import gridIcon from "../../assets/grid.svg";
import helpIcon from "../../assets/dashhelp.svg";
import contactIcon from "../../assets/dashphone.svg";
import userIcon from "../../assets/dashuser.svg";
import { useSelector } from "react-redux";

const Sidebar = ({ activeSection, setActiveSection, onCreateWorkspace, onJoinWorkspace }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: gridIcon },
    { id: "notification", label: "Notification", icon: notificationIcon },
    { id: "files", label: "File Sharing", icon: folderIcon },
    { id: "events", label: "Meeting", icon: calendarIcon },
  ];

  const profile = useSelector((state) => state.user.profile);
  localStorage.setItem("isLogged", "false");

  const { fullName, email, avatar } = profile || {};

  return (
    <aside className="w-[340px] h-[900px] bg-[#240A44] text-white flex flex-col p-5.5 pt-4.5">
      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-1 mb-8">
          <img src={logo} alt="logo" className="w-15 h-10" />
          <p className="text-4xl pb-3 font-semibold text-[#F9F6FC]">vow</p>
        </div>

        {/* Profile */}
        <div className="rounded-2xl border border-dashed border-[#EFE7F6] px-2 py-2 mb-8 mt-1">
          <div className="flex items-center gap-3">
            <img src={avatar ? avatar : userIcon} alt="Avatar" className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-white h-5 font-semibold text-[18px] leading-6">{fullName || "Guest"}</p>
              <p className="text-[14px] text-[#B9B0C8]">{email || "No Email"}</p>
            </div>
          </div>
        </div>

        {/* Workspace Buttons */}
        <div className="flex flex-col gap-4 mb-8">
          <button
            onClick={onCreateWorkspace}
            className="flex w-full h-10 items-center justify-center gap-4 px-4 rounded-xl bg-[#5E9BFF] text-white hover:brightness-110 transition"
          >
            <img src={createIcon} alt="Create" className="w-6 h-6 shrink-0 filter brightness-0 invert" />
            <span className="text-[16px] leading-6">Create Workspace</span>
          </button>

          <button
            onClick={onJoinWorkspace}
            className="flex w-full h-10 items-center justify-center gap-4 px-4 rounded-xl bg-[#5E9BFF] text-white hover:brightness-110 transition"
          >
            <img src={keyIcon} alt="Join" className="w-6 h-6 shrink-0 filter brightness-0 invert" />
            <span className="text-[16px] leading-6">Join Workspace</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3.5 px-3 py-2 rounded-xl transition-all ${
                activeSection === item.id
                  ? "bg-[linear-gradient(90deg,#8231CC_0%,#29064A_83.93%)] text-white font-medium"
                  : "hover:bg-[#3a0060] text-gray-200"
              }`}
            >
              <img src={item.icon} alt={item.label} className="w-6 h-6 filter brightness-0 invert" />
              <span className="text-[22px] font-normal">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[#450B7B] pt-4 space-y-2">
        <button className="flex items-center gap-3 text-left px-3 py-2 rounded-xl hover:bg-[linear-gradient(90deg,#8231CC_0%,#29064A_83.93%)] text-gray-200 transition-all w-full">
          <img src={helpIcon} alt="Help" className="w-6 h-6 filter brightness-0 invert" />
          <span className="text-[22px] font-normal">Need Help</span>
        </button>
        <button className="flex items-center gap-3 text-left px-3 py-2 rounded-xl hover:bg-[linear-gradient(90deg,#8231CC_0%,#29064A_83.93%)] text-gray-200 transition-all w-full">
          <img src={contactIcon} alt="Contact" className="w-6 h-6 filter brightness-0 invert" />
          <span className="text-[22px] font-normal">Contact Us</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;