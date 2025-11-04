import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./Topbar.jsx";
import DashboardContainer from "./DashboardContainer.jsx";
import CreateWorkspace from "./CreateWorkspace.jsx";
import SearchSection from "./SearchSection.jsx";
import NotificationSection from "./NotificationSection.jsx";
import MeetingSection from "./MeetingSection.jsx";
import EnterWorkspaceSection from "./EnterWorkspaceSection.jsx";
import dashboardBg from "../../assets/dashboardbg.svg";
import TeamBuilder from "../chat/teambuilder.jsx";
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
        return <TeamBuilder />;
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
