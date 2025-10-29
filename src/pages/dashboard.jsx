import React from "react";
import logo from "../assets/logo.png"; 
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#EFE7F6] flex flex-col items-center">
      {/* Navbar */}
      <header className="w-[964px] h-[72px] bg-white flex justify-between items-center border border-[#BCBCBC] rounded-[16px] px-[20px] mt-[15px]">
        <div className="flex items-center gap-[10px]">
          <img src={logo} alt="VOW Logo" className="h-[24px]" />
          <span className="text-[#5C0EA4] font-bold text-[20px] leading-[24px]">
            VOW
          </span>
        </div>

        <div className="text-[#0E1219] font-bold text-[20px] leading-[24px]">
          Dashboard
        </div>
        {/* avatar and email */}
        <div className="flex items-center gap-[10px]">
          <div className="flex items-center gap-[8px] bg-[#E9EAEB] rounded-[12px] py-[8px] px-[8px]">
            <div
              className="w-[36px] h-[36px] rounded-full bg-[#5E9BFF]"
              title="User Avatar"
            ></div>
            <div className="flex flex-col">
              <span className="text-[#5C0EA4] font-semibold text-[16px] leading-[19.2px]">
                Fullname
              </span>
              <span className="text-[#5C0EA4] font-normal text-[12px] leading-[14.4px]">
                abcd4321@xyz.ac.in
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Back Section */}
      <section className="w-[562px] flex flex-col items-center text-center mt-[77px] ">
        <h1 className="text-[#0E1219] font-semibold text-[40px] leading-[48px]">
          Welcome back, <span className="text-[#370862]">Fullname</span>.
        </h1>
        <p className="text-[#1F2937] font-normal text-[24px] leading-[28.8px]">
          Your space to create, connect, and grow on VOW.
        </p>
        <div className="w-[414px] flex items-center mt-[40px]">
          <input
            type="text"
            placeholder="Search for people, workspace or files"
            className="w-full h-[44px] px-[10px] rounded-[10px] border border-[#707070] text-[#707070] text-[16px] leading-[19px] bg-white"
          />
        </div>
        <div className="flex gap-[24px] mt-[64px]">
          <button className="w-[350px] h-[44px] bg-[#5E9BFF] text-white text-[20px] font-normal leading-[24px] rounded-[8px] border border-[#1F2937] hover:bg-[#4A8CE0] transition">
            Create New Workspace
          </button>
          <button 
          onClick={() => navigate("/map")}
          className="w-[350px] h-[44px] bg-white text-[#450B7B] text-[20px] font-normal leading-[24px] rounded-[8px] border border-[#450B7B] hover:bg-[#F5F5F5] transition">
            Join Existing Workspace
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full max-w-[1200px] mt-8 px-4">
        {/* Workspace Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6 border border-[#BCBCBC]">
            <h2 className="text-xl font-semibold mb-4">Workspace name</h2>
            <p className="text-gray-600 mb-4">Recent activity: 6 hours ago</p>
            <button className="bg-[#450B7B] text-white py-2 px-4 rounded-md hover:bg-[#5c0ea4] transition">
              Enter office
            </button>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 border border-[#BCBCBC]">
            <h2 className="text-xl font-semibold mb-4">Create a new workspace</h2>
            <button className="bg-[#450B7B] text-white py-2 px-4 rounded-md hover:bg-[#5c0ea4] transition">
              Enter office
            </button>
          </div>
        </div>

        {/* Events and Chats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-[#BCBCBC]">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="flex items-center justify-between mb-4">
              <button className="text-[#450B7B]">Previous</button>
              <span>November 2025</span>
              <button className="text-[#450B7B]">Next</button>
            </div>
            <div className="space-y-4">
              <div className="bg-[#EDE7F6] p-4 rounded-md border border-[#BCBCBC]">
                <p className="text-sm text-[#450B7B]">Non-urgent</p>
                <h3 className="text-lg font-semibold">Event Title</h3>
                <p className="text-gray-600">09:00-09:45 AM IST</p>
              </div>
              <div className="bg-[#FAD4D4] p-4 rounded-md border border-[#BCBCBC]">
                <p className="text-sm text-[#D32F2F]">Urgent</p>
                <h3 className="text-lg font-semibold">Event Title</h3>
                <p className="text-gray-600">09:00-09:45 AM IST</p>
              </div>
            </div>
          </div>
          {/* Recent Chats */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-[#BCBCBC]">
            <h2 className="text-xl font-semibold mb-4">Recent Chats</h2>
            <ul className="space-y-4">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-[#EDE7F6] p-4 rounded-md border border-[#BCBCBC]"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">Workspace name</h3>
                      <p className="text-gray-600">Fullname: Text Message</p>
                    </div>
                    <button className="text-[#450B7B]">View</button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer 
      className="mt-auto  w-full " />
    </div>
  );
};

export default Dashboard;
