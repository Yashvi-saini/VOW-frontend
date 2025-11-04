import React, { useState } from "react";
import Sidebar from "../Dashboard/Sidebar";
import TopBar from "../Dashboard/Topbar";
import DashboardContainer from "../Dashboard/DashboardContainer";
import CreateWorkspace from "../Dashboard/CreateWorkspace";
import SearchSection from "../Dashboard/SearchSection";
import NotificationSection from "../Dashboard/NotificationSection";
import MeetingSection from "../Dashboard/MeetingSection";
import EnterWorkspaceSection from "../Dashboard/EnterWorkspaceSection";
import dashboardBg from "../../assets/dashboardbg.svg";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContainer />;
      case "createWorkspace":
        return <CreateWorkspace />;
      case "search":
        return <SearchSection />;
      case "notification":
        return <NotificationSection />;
      case "events":
        return <MeetingSection role="supervisor" />;
      case "enterWorkspace":
        return <EnterWorkspaceSection />;
      case "create team":
      default:
        return <DashboardContainer />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F6FC] font-poppins">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col h-[820px]">
        <TopBar />
        <main className="flex-1 p-8 overflow-y-auto relative bg-[#FEFEFE]">
          {renderSection()}
          <div
              className="absolute inset-0 w-full h-full bg-no-repeat bg-bottom bg-contain opacity-80 pointer-events-none"
              style={{ backgroundImage: `url(${dashboardBg})` }}
            />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
