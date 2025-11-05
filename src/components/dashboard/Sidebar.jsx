import React from "react";
import logo from "../../assets/logo.png";
import searchIcon from "../../assets/dashsearch.svg";
import notificationIcon from "../../assets/dashnotify.svg";
import eventsIcon from "../../assets/dashevents.svg";
import workspaceIcon from "../../assets/dashgmail.svg";
import createIcon from "../../assets/dashcreate.svg";
import helpIcon from "../../assets/dashhelp.svg";
import contactIcon from "../../assets/dashphone.svg";
import userIcon from "../../assets/dashuser.svg";
import { useSelector } from "react-redux";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: userIcon },
    { id: "search", label: "Search", icon: searchIcon },
    { id: "notification", label: "Notification", icon: notificationIcon },
    { id: "events", label: "Meeting", icon: eventsIcon },
    { id: "enterWorkspace", label: "Enter Workspace", icon: workspaceIcon },
    { id: "createWorkspace", label: "Create Workspace", icon: createIcon },
    {id: "create team", label: "Create Team", icon: createIcon}
  ];
 const { fullName, email, avatar } = useSelector((state) => state.user);
  return (
    <aside className="w-[320px] h-[820px] bg-[#240A44] text-white flex flex-col p-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <p className="text-2xl font-bold text-[#F9F6FC]">vow</p>
        </div>

        <div className="bg-[#EFE7F6] p-3 rounded-xl mb-10 h-[55px]">
          <div className="flex items-center gap-3">
            <img src={avatar ? avatar : userIcon} alt="Avatar" className="w-8 h-8 rounded-full" />
            <div>
              <p className="font-semibold text-[#0E1219] text-sm">{fullName || "Guest"}</p>
              <p className="text-xs text-[#47505B]">{email || "No Email"}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 text-left text-[20px] px-4 py-3 rounded-[16px] transition-all ${
                activeSection === item.id
                  ? "bg-[linear-gradient(90deg,#8231CC_0%,#29064A_83.93%)] text-white font-medium"
                  : ""
              }`}
            >
              <img src={item.icon} alt={item.label} className="w-5 h-5 filter brightness-0 invert" />
              <span className="text-[20px] font-normal">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-[#450B7B] pt-4 space-y-2">
        <button className="flex items-center gap-3 text-left px-4 py-2 rounded-lg 
             hover:bg-[linear-gradient(90deg,#8231CC_0%,#29064A_83.93%)] text-gray-200 transition-all w-full">
          <img src={helpIcon} alt="Help" className="w-5 h-5 filter brightness-0 invert" />
          <span className="text-[20px] font-normal">Need Help</span>
        </button>
        <button className="flex items-center gap-3 text-left px-4 py-2 rounded-lg hover:bg-[linear-gradient(90deg,#8231CC_0%,#29064A_83.93%)] text-gray-200 transition-all w-full">
          <img src={contactIcon} alt="Contact" className="w-5 h-5 filter brightness-0 invert" />
          <span className="text-[20px] font-normal">Contact Us</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
