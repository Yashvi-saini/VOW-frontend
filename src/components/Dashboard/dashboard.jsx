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
        return <MeetingSection role="manager" />;
      case "enterWorkspace":
        return <EnterWorkspaceSection />;
      default:
        return <DashboardContainer />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F6FC] font-poppins">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-8 overflow-y-auto relative bg-[#F8F6FC]">
          {renderSection()}
          <div
              className="absolute bottom-0 left-10 right-0 h-[532px] w-[1280px] bg-no-repeat bg-center bg-cover opacity-0.8"
              style={{ backgroundImage: `url(${dashboardBg})` }}
            ></div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
