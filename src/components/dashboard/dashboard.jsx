import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import DashboardContainer from "./DashboardContainer";
import CreateWorkspace from "./CreateWorkspace";
import SearchSection from "./SearchSection";
import NotificationSection from "./NotificationSection";
import MeetingSection from "./MeetingSection";
import EnterWorkspaceSection from "./EnterWorkspaceSection";
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
    //add comment
  );
};
export default Dashboard;
