import React, { useState } from "react";
import logo from "/logo.svg";
import Footer from "../footer";
import { useNavigate } from "react-router-dom";
import Sidebar from "./dash-components/sidebar.jsx";
import UpcomingEvents from "../dashboard/dash-components/upcomingevents.jsx";
import { createWorkspace } from "../../api/authApi.js";
import JoinedWorkspaces from "../dashboard/userdetails.jsx" ;
import MembersList from "../dashboard/members.jsx";
const Dashboard = () => {
  const navigate = useNavigate();

  const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [emails, setEmails] = useState("");

 const handleSubmit = async () => {
  const emailArray = emails
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email);

  const payload = {
    workspaceName,
    inviteEmails: emailArray,
  };

  try {
    const response = await createWorkspace(payload);
    console.log("Workspace created:", response.data);

    // Extract important fields
 const { workspace, workspaceToken } = response.data;
const workspaceId = workspace._id || workspace.id;
const inviteCode = workspace.inviteCode;


    // Store in localStorage (or state, depending on your use case)
    localStorage.setItem("workspaceId", workspaceId);
    localStorage.setItem("inviteCode", inviteCode);
    localStorage.setItem("workspaceToken", workspaceToken);

    alert("Workspace created successfully!");

    // Reset form
    setShowWorkspaceForm(false);
    setWorkspaceName("");
    setEmails("");
  } catch (error) {
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("Error creating workspace:", error.response.data);
      alert(
        `Error: ${
          error.response.data.message || "Workspace creation failed."
        }`
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
      alert("No response from server. Please check your connection.");
    } else {
      // Something else happened
      console.error("Unexpected error:", error.message);
      alert("Unexpected error occurred.");
    }
  }
};



  return (
    <div className="min-h-screen bg-[#EFE7F6] flex flex-col items-center">
      <Sidebar />

      {/* Navbar */}
      <header className="w-full max-w-5xl bg-white flex flex-wrap justify-between items-center border border-[#BCBCBC] rounded-2xl px-4 sm:px-5 py-3 mt-4 mx-4 md:mx-0 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={logo} alt="VOW Logo" className="h-6 w-auto" />
          <span className="text-[#5C0EA4] font-bold text-base sm:text-lg leading-6 truncate">VOW</span>
        </div>

        <div className="text-[#0E1219] font-bold text-base text-center sm:text-lg leading-6 order-last sm:order-0 w-full sm:w-auto text-center sm:text-left">
          Dashboard
        </div>

        {/* avatar and email */}
        <div className="flex items-center gap-2.5 ml-auto">
          <div className="flex items-center gap-2 bg-[#E9EAEB] rounded-xl py-2 px-2">
            <div className="w-9 h-9 rounded-full bg-[#5E9BFF] shrink-0" title="User Avatar"></div>
            <div className="flex flex-col min-w-0">
              <span className="text-[#5C0EA4] font-semibold text-sm leading-5 truncate">Fullname</span>
              <span className="text-[#5C0EA4] font-normal text-xs leading-4 truncate hidden md:block">abcd4321@xyz.ac.in</span>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Back Section */}
      <section className="w-full max-w-3xl flex flex-col items-center text-center mt-12 px-4">
        <h1 className="text-[#0E1219] font-semibold text-3xl sm:text-4xl leading-10">
          Welcome back, <span className="text-[#370862]">Fullname</span>.
        </h1>
        <p className="text-[#1F2937] font-normal text-lg sm:text-xl leading-7 mt-2">
          Your space to create, connect, and grow on VOW.
        </p>
        <div className="w-full max-w-md flex items-center mt-8">
          <input
            type="text"
            placeholder="Search for people, workspace or files"
            className="w-full h-11 px-3 rounded-xl border border-[#707070] text-[#707070] text-base leading-5 bg-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row w-full max-w-3xl gap-4 mt-16">
          <button
            onClick={() => setShowWorkspaceForm(true)}
            className="w-full sm:w-auto px-6 h-11 bg-[#5E9BFF] text-white text-lg font-normal rounded-lg border border-[#1F2937] hover:bg-[#4A8CE0] transition"
          >
            Create New Workspace
          </button>
          <button
  onClick={() => navigate("/join")}
  className="w-full sm:w-auto px-6 h-11 bg-white text-[#450B7B] text-lg font-normal rounded-lg border border-[#450B7B] hover:bg-[#F5F5F5] transition"
>
  Join Existing Workspace
</button>
        <JoinedWorkspaces/>
        <MembersList/>
        </div>
      
        {showWorkspaceForm && (
          <div className="w-full max-w-3xl mt-6 bg-white p-6 rounded-lg shadow-md border border-[#BCBCBC]">
            <h3 className="text-lg font-semibold mb-4 text-[#450B7B]">Create Workspace</h3>

            <label className="block mb-2 text-sm font-medium text-gray-700">Workspace Name</label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Emails (comma-separated)</label>
            <input
              type="text"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="e.g. user1@example.com, user2@example.com"
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
            />

            <button
              onClick={handleSubmit}
              className="bg-[#450B7B] text-white px-4 py-2 rounded-md hover:bg-[#5c0ea4] transition"
            >
              Submit
            </button>
          </div>
        )}
      </section>

      {/* Main Content */}
      <main className="w-full max-w-6xl mt-8 px-4">
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
          <UpcomingEvents />
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

      <Footer className="mt-auto w-full" />
    </div>
  );
};

export default Dashboard;