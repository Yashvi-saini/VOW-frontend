import React, { useState } from "react";
import logo from "../assets/logo.png";
import dashboardBg from "../assets/dashboardbg.svg";
import searchIcon from "../assets/dashsearch.svg";
import notificationIcon from "../assets/dashnotify.svg";
import eventsIcon from "../assets/dashevents.svg";
import workspaceIcon from "../assets/dashgmail.svg";
import createIcon from "../assets/dashcreate.svg";
import helpIcon from "../assets/dashhelp.svg";
import contactIcon from "../assets/dashphone.svg";
import userIcon from "../assets/dashuser.svg";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex h-screen bg-[#F8F6FC] font-poppins">
      {/* Sidebar */}
      <aside className="w-[320px] bg-[#240A44] text-white flex flex-col p-6">
        <div className="flex-1">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src={logo} alt="logo" className="w-8 h-8" />
            <p className="text-2xl font-bold text-[#F9F6FC]">vow</p>
          </div>

          {/* User info */}
          <div className="bg-[#450B7B] p-4 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5E9BFF] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">F</span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Fullname</p>
                <p className="text-xs text-gray-300">abcd4321@xyz.ac.in</p>
              </div>
            </div>
          </div>

          {/* Menu  */}
          <nav className="flex flex-col space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: userIcon },
              { id: "search", label: "Search", icon: searchIcon },
              { id: "notification", label: "Notification", icon: notificationIcon },
              { id: "events", label: "Events", icon: eventsIcon },
              { id: "enterWorkspace", label: "Enter Workspace", icon: workspaceIcon },
              { id: "createWorkspace", label: "Create Workspace", icon: createIcon },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? "bg-[#450B7B] text-white font-medium"
                    : "hover:bg-[#35125D] text-gray-200"
                }`}
              >
                <img src={item.icon} alt={item.label} className="w-5 h-5 filter brightness-0 invert" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-[#450B7B] pt-4 space-y-2">
          <button className="flex items-center gap-3 text-left px-4 py-2 rounded-lg hover:bg-[#35125D] text-gray-200 transition-all w-full">
            <img src={helpIcon} alt="Help" className="w-5 h-5 filter brightness-0 invert" />
            <span className="text-sm">Need Help</span>
          </button>
          <button className="flex items-center gap-3 text-left px-4 py-2 rounded-lg hover:bg-[#35125D] text-gray-200 transition-all w-full">
            <img src={contactIcon} alt="Contact" className="w-5 h-5 filter brightness-0 invert" />
            <span className="text-sm">Contact Us</span>
          </button>
        </div>
      </aside>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-[#240A44] text-white px-8 py-4 flex justify-between items-center">
          <span className="text-lg ml-8 font-medium">Welcome back, Fullname</span>
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for people, workspace or files"
                className=" bg-[#200539] text-[#9982B4] rounded-lg px-4 py-2 w-96 border-[1px] border-[#9982B4] text-sm"
              />
              <img src={searchIcon} alt="search" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto relative bg-[#F8F6FC]">
          {/* Background Image */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[632px] w-[1288px] bg-no-repeat bg-center bg-contain opacity-0.8"
            style={{ backgroundImage: `url(${dashboardBg})` }}
          ></div>

          {activeSection === "dashboard" && (
            <div className="relative z-10">
              {/* Top Cards */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-[#EFE7F6] rounded-xl p-6  border border-[#8F7AA9] flex flex-col justify-between min-h-[180px]">
                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-[#0E1219]">Workspace name</h3>
                    <p className="text-sm text-[#6B7280] mb-4">
                      Recent activity: 6 hours ago
                    </p>
                  </div>
                  <button className="bg-[#5E9BFF] text-white px-6 py-2 rounded-lg hover:bg-[#4A8CE0] transition self-start font-medium text-sm">
                    Enter office
                  </button>
                </div>

                <div className="bg-[#EFE7F6] rounded-xl p-6 shadow-sm border border-[#8F7AA9] flex flex-col justify-between min-h-[180px]">
                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-[#0E1219]">Create Workspace</h3>
                    <p className="text-sm text-[#6B7280] mb-4">
                      Perfect for new teams or fresh projects.
                    </p>
                  </div>
                  <button className="bg-[#5E9BFF] text-white px-6 py-2 rounded-lg hover:bg-[#4A8CE0] transition self-start font-medium text-sm">
                    Create
                  </button>
                </div>

                <div className="bg-[#EFE7F6] rounded-xl p-6 shadow-sm border border-[#8F7AA9] flex flex-col justify-between min-h-[180px]">
                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-[#0E1219]">Join New Workspace</h3>
                    <input
                      type="text"
                      placeholder="Enter the Workspace ID to join"
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-3 text-sm focus:outline-none focus:border-[#5E9BFF] text-[#6B7280]"
                    />
                  </div>
                  <button className="bg-[#5E9BFF] text-white px-6 py-2 rounded-lg hover:bg-[#4A8CE0] transition self-start font-medium text-sm">
                    Join Now
                  </button>
                </div>
              </div>

              {/* Bottom Section  */}
              <div className="grid grid-cols-2 gap-6 ">
                <div className="bg-[#EFE7F6] rounded-xl p-6 shadow-sm border border-[#8F7AA9] flex flex-col min-h-[350px]">
                  <h4 className="font-semibold mb-4 text-lg text-[#0E1219]">Upcoming Events</h4>
                  <div className="flex items-center justify-between mb-4">
                    <button className="text-[#5E9BFF] hover:text-[#4A8CE0] font-medium text-sm">Previous</button>
                    <span className="font-medium text-[#0E1219] text-sm">November 2025</span>
                    <button className="text-[#5E9BFF] hover:text-[#4A8CE0] font-medium text-sm">Next</button>
                  </div>
                  <div className="space-y-3 flex-grow">
                    <div className="bg-[#5C0EA4] text-white p-4 rounded-lg">
                      <p className="text-sm font-medium">Event Title</p>
                      <p className="text-xs opacity-90">09:00-09:45 AM IST</p>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-lg">
                      <p className="text-sm font-medium text-[#0E1219]">Event Title</p>
                      <p className="text-xs text-[#6B7280]">09:00-09:45 AM IST</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#EFE7F6] rounded-xl p-6 shadow-sm border border-[#8F7AA9] flex flex-col min-h-[350px]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg text-[#0E1219]">Recent Chats</h4>
                    <span className="text-sm text-[#6B7280]">5 unread messages</span>
                  </div>
                  <div className="space-y-3 flex-grow">
                    {Array(3)
                      .fill(null)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-[#EFE7F6] rounded-lg hover:bg-gray-100 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#5E9BFF] rounded-full flex items-center justify-center text-white font-semibold">
                              W
                            </div>
                            <div>
                              <p className="font-medium text-sm text-[#0E1219]">Workspace name</p>
                              <p className="text-xs text-[#6B7280]">Fullname: Text Message</p>
                            </div>
                          </div>
                          <button className="text-[#5E9BFF] hover:text-[#4A8CE0] text-sm font-medium">
                            →
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Create Workspace Section */}
          {activeSection === "createWorkspace" && (
            <div className="relative z-10">
              <div className="max-w-lg space-y-6">
                <h2 className="text-2xl font-semibold mb-6 text-[#0E1219]">Create a New Workspace</h2>
                <div>
                  <label className="block font-medium mb-2 text-[#0E1219]">Workspace Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Design Studio, Growth Team, Marketing Hub"
                    className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#6B7280]"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-[#0E1219]">
                    Choose Workspace Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <button className="text-xl font-bold text-[#5E9BFF] hover:text-[#4A8CE0]">{"<"}</button>
                    {Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-full bg-gray-300 hover:bg-[#5E9BFF] cursor-pointer transition-all"
                        ></div>
                      ))}
                    <button className="text-xl font-bold text-[#5E9BFF] hover:text-[#4A8CE0]">{">"}</button>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-[#0E1219]">Total Members</label>
                  <div className="flex gap-3">
                    <button className="border border-gray-300 px-4 py-2 rounded-lg hover:border-[#5E9BFF] hover:bg-[#5E9BFF]/10 transition text-[#6B7280]">{"<20"}</button>
                    <button className="border border-gray-300 px-4 py-2 rounded-lg hover:border-[#5E9BFF] hover:bg-[#5E9BFF]/10 transition text-[#6B7280]">21–40</button>
                    <button className="bg-[#5E9BFF] text-white px-4 py-2 rounded-lg hover:bg-[#4A8CE0] transition">
                      41–60
                    </button>
                    <button className="border border-gray-300 px-4 py-2 rounded-lg hover:border-[#5E9BFF] hover:bg-[#5E9BFF]/10 transition text-[#6B7280]">61–80</button>
                  </div>
                </div>

                <button className="bg-[#5E9BFF] text-white px-8 py-3 rounded-lg mt-6 hover:bg-[#4A8CE0] transition font-medium">
                  Create Workspace
                </button>
              </div>
            </div>
          )}

          {/* Other sections */}
          {activeSection === "search" && (
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-6 text-[#0E1219]">Search</h2>
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#6B7280]"
                />
                <img src={searchIcon} alt="search" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
              </div>
            </div>
          )}

          {activeSection === "notification" && (
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-6 text-[#0E1219]">Notifications</h2>
              <p className="text-[#6B7280]">No new notifications yet.</p>
            </div>
          )}

          {activeSection === "events" && (
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-6 text-[#0E1219]">Events</h2>
              <p className="text-[#6B7280]">Next Meeting: 10th Nov 2025</p>
            </div>
          )}

          {activeSection === "enterWorkspace" && (
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-6 text-[#0E1219]">Enter Workspace</h2>
              <p className="text-[#6B7280]">Enter Workspace ID to join.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default Dashboard;