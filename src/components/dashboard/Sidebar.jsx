import React from "react";
import logo from "../../assets/logo.png";
import notificationIcon from "../../assets/dashnotify.svg";
import calendarIcon from "../../assets/today.svg"; 
import createIcon from "../../assets/dashcreate.svg"; 
import keyIcon from "../../assets/Key.svg"; 
import personIcon from "../../assets/person.svg"; 
import folderIcon from "../../assets/folder.svg"; 
import gridIcon from "../../assets/grid.svg"; 
import helpIcon from "../../assets/dashhelp.svg";
import contactIcon from "../../assets/dashphone.svg";
import userIcon from "../../assets/dashuser.svg";
import { useSelector } from "react-redux";

const Sidebar = ({ activeSection, setActiveSection, onCreateWorkspace, onJoinWorkspace }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: personIcon },
    { id: "notification", label: "Notification", icon: notificationIcon },
    { id: "events", label: "Meeting", icon: calendarIcon },
    { id: "files", label: "File Sharing", icon: folderIcon },
  ];
  const trailingIcons = {
    dashboard: <img src={gridIcon} alt="grid" className="w-6 h-6" />,
    files: <img src={personIcon} alt="person" className="w-6 h-6" />,
  };
const profile = useSelector((state) => state.user.profile);


localStorage.setItem("isLogged", "false");
const { fullName, email, avatar } = profile || {};
  return (
  <aside className="w-[320px] h-[900px] bg-[#240A44] text-white flex flex-col p-6">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <p className="text-2xl font-bold text-[#F9F6FC]">vow</p>
        </div>

        
        <button
          onClick={() => setActiveSection('profile')}
          className="rounded-2xl border border-dashed border-[#EFE7F6] px-4 py-3 mb-8 w-full text-left hover:bg-[#2E0F52] transition"
        >
          <div className="flex items-center gap-3">
            <img src={avatar ? avatar : userIcon} alt="Avatar" className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-white font-semibold text-[16px] leading-6">{fullName || "Guest"}</p>
              <p className="text-xs text-[#B9B0C8]">{email || "No Email"}</p>
            </div>
          </div>
        </button>

        
        <div className="flex flex-col gap-4 mb-8">
          <button
            onClick={onCreateWorkspace}
            className="flex w-full h-10 items-center justify-center gap-4 px-4 rounded-xl bg-[#5E9BFF] text-white hover:brightness-110 transition"
          >
           
            <img src={createIcon} alt="Create" className="w-5 h-5 shrink-0 filter brightness-0 invert" />
            <span className="text-[16px] leading-6 font-medium">Create Workspace</span>
          </button>
          <button
            onClick={onJoinWorkspace}
            className="flex w-full h-10 items-center justify-center gap-4 px-4 rounded-xl bg-[#5E9BFF] text-white hover:brightness-110 transition"
          >
            
            <img src={keyIcon} alt="Join" className="w-5 h-5 shrink-0 filter brightness-0 invert" />
            <span className="text-[16px] leading-6 font-medium">Join Workspace</span>
          </button>
        </div>

        {/* navigation list */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center justify-between gap-3 text-left text-[16px] px-3 py-2 rounded-xl transition-all ${
                activeSection === item.id
                  ? "bg-[linear-gradient(90deg,#8231CC_0%,#29064A_83.93%)] text-white font-medium"
                  : ""
              }`}
            >
              <span className="flex items-center gap-3">
                <img src={item.icon} alt={item.label} className="w-5 h-5 filter brightness-0 invert" />
                <span className="text-[16px] font-normal">{item.label}</span>
              </span>
             
              <span className="shrink-0">
                {trailingIcons[item.id] || null}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-[#450B7B] pt-4 space-y-2">
  <button className="flex items-center gap-3 text-left px-3 py-2 rounded-xl 
             hover:bg-[linear-gradient(90deg,#8231CC_0%,#29064A_83.93%)] text-gray-200 transition-all w-full">
          <img src={helpIcon} alt="Help" className="w-5 h-5 filter brightness-0 invert" />
          <span className="text-[16px] font-normal">Need Help</span>
        </button>
  <button className="flex items-center gap-3 text-left px-3 py-2 rounded-xl hover:bg-[linear-gradient(90deg,#8231CC_0%,#29064A_83.93%)] text-gray-200 transition-all w-full">
          <img src={contactIcon} alt="Contact" className="w-5 h-5 filter brightness-0 invert" />
          <span className="text-[16px] font-normal">Contact Us</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
