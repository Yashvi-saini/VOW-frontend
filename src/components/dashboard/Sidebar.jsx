import React, { useState, useRef, useEffect } from "react";
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
import closeIcon from "../../assets/cross.svg"; // ✅ Add a close icon (use any "X" SVG from your assets)
import { useSelector } from "react-redux";


const Sidebar = ({
  activeSection,
  setActiveSection,
  onCreateWorkspace,
  onJoinWorkspace,
  isSidebarOpen,
  setIsSidebarOpen,
  onNeedHelp,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: gridIcon },
   
    { id: "files", label: "File Sharing", icon: folderIcon },
    { id: "events", label: "Meeting", icon: calendarIcon },
  ];

  const profile = useSelector((state) => state.user.profile);
  localStorage.setItem("isLogged", "false");

  const { fullName, email, avatar } = profile || {};

  const [showContactModal, setShowContactModal] = useState(false);
  const contactModalRef = useRef(null);

  const handleMenuClick = (id) => {
    setActiveSection(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  // Close contact modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactModalRef.current && !contactModalRef.current.contains(event.target)) {
        setShowContactModal(false);
      }
    };

    if (showContactModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showContactModal]);


  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          lg:min-h-[110vh]
          w-[340px]  bg-[#240A44] text-white flex flex-col p-5.5 pt-4.5
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ✅ Top section with logo + close icon */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="flex items-center gap-1">
            <img src={logo} alt="logo" className="w-12.5 h-10" />
            <p className="text-4xl pb-3 font-semibold text-[#F9F6FC]">vow</p>
          </div>

          {/* ❌ Close icon — only visible on small screens */}
          <button
            className="lg:hidden absolute right-0 top-1 p-2 hover:bg-white/10 rounded-md"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <img src={closeIcon} alt="Close" className="w-5 h-5 invert" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar">
          {/* Profile */}
          <div className="rounded-2xl border border-dashed border-[#EFE7F6] px-2 py-2 mb-8 mt-1">
            <div className="flex items-center gap-3">
              <img  onClick={(e)=>{
                e.preventDefault();
                 setActiveSection("profile");

              }}
                src={avatar ? avatar : userIcon}
                alt="Avatar"
                className="w-9 h-9 rounded-full"
              />
              <div>
                <p className="text-white text-[16px] font-semibold leading-6">
                  {fullName || "Guest"}
                </p>
                <p className="text-[12px] text-[#B9B0C8]">{email || "No Email"}</p>
              </div>
            </div>
          </div>

          {/* Workspace Buttons */}
          <div className="flex flex-col gap-4 mb-8">
            <button
              onClick={onCreateWorkspace}
              className="flex w-full h-10 items-center justify-center gap-4 px-4 rounded-xl bg-[#5E9BFF] text-white hover:brightness-110 transition"
            >
              <img
                src={createIcon}
                alt="Create"
                className="w-6 h-6 shrink-0 filter brightness-0 invert"
              />
              <span className="text-[16px] leading-6">Create Workspace</span>
            </button>

            <button
              onClick={onJoinWorkspace}
              className="flex w-full h-10 items-center justify-center gap-4 px-4 rounded-xl bg-[#5E9BFF] text-white hover:brightness-110 transition"
            >
              <img
                src={keyIcon}
                alt="Join"
                className="w-5 h-5 shrink-0 filter brightness-0 invert"
              />
              <span className="text-[16px] leading-6">Join Workspace</span>
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-2 mt-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`flex items-center gap-3.5 px-2 py-2 transition-all ${
                  activeSection === item.id
                    ? "bg-[#37086A] rounded-[0_14px_14px_0] text-white font-medium border-l-4 border-[#AC92CB]"
                    : "hover:bg-[#3a0060] rounded-[0_14px_14px_0] text-gray-200"
                }`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-6 h-6 filter brightness-0 invert"
                />
                <span className="text-[20px] font-normal">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#450B7B] pt-4 space-y-2">
          <button 
            onClick={onNeedHelp}
            className="flex items-center gap-3 text-left px-3 py-2 rounded-xl hover:bg-[linear-gradient(90deg,#8231CC_0%,#29064A_83.93%)] text-gray-200 transition-all w-full"
          >
            <img
              src={helpIcon}
              alt="Help"
              className="w-6 h-6 filter brightness-0 invert"
            />
            <span className="text-[20px] font-normal">Need Help</span>
          </button>
          <button 
            onClick={() => setShowContactModal(true)}
            className="flex items-center gap-3 text-left px-3 py-2 rounded-xl hover:bg-[linear-gradient(90deg,#8231CC_0%,#29064A_83.93%)] text-gray-200 transition-all w-full"
          >
            <img
              src={contactIcon}
              alt="Contact"
              className="w-6 h-6 filter brightness-0 invert"
            />
            <span className="text-[20px] font-normal">Contact Us</span>
          </button>
        </div>
      </aside>

      {/* Contact Us Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            ref={contactModalRef}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#240A44]">Contact Us</h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-linear-to-r from-[#8231CC]/10 to-[#5E9BFF]/10 rounded-xl border border-[#8231CC]/20">
                <div className="shrink-0 w-12 h-12 bg-linear-to-br from-[#8231CC] to-[#5E9BFF] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Email us at</p>
                  <a 
                    href="mailto:vow.org8000@gmail.com"
                    className="text-[#8231CC] font-semibold hover:underline"
                  >
                    vow.org8000@gmail.com
                  </a>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                We'll get back to you as soon as possible!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
