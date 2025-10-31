import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import DashboardMain from "./DashboardMain";
import CreateWorkspace from "./CreateWorkspace";
import SearchSection from "./SearchSection";
import NotificationSection from "./NotificationSection";
import EventsSection from "./EventSection";
import EnterWorkspaceSection from "./EnterWorkspaceSection";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardMain />;
      case "createWorkspace":
        return <CreateWorkspace />;
      case "search":
        return <SearchSection />;
      case "notification":
        return <NotificationSection />;
      case "events":
        return <EventsSection />;
      case "enterWorkspace":
        return <EnterWorkspaceSection />;
      default:
        return <DashboardMain />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F6FC] font-poppins">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-8 overflow-y-auto relative bg-[#F8F6FC]">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
