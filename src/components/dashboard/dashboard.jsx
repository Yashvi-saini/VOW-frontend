import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import DashboardContainer from "./DashboardContainer";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import JoinWorkspaceModal from "./JoinWorkspaceModal";
import SearchSection from "./SearchSection";
import NotificationSection from "./NotificationSection";
import MeetingSection from "./MeetingSection";
import FileTransfer from "./FileTransfer";
import dashboardBg from "../../assets/dashboardbg.svg";
import TeamBuilder from "../chat/teambuilder.jsx";
import ProfileSettings from "../profilegeneration/ProfileSettings.jsx";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContainer />;
      case "search":
        return <SearchSection />;
      case "notification":
        return <NotificationSection />;
      case "events":
        return <MeetingSection role="supervisor" />;
      case "create team":
        return <TeamBuilder />;
      case "files":
        return <FileTransfer />;
      case "profile":
        return <ProfileSettings onClose={() => setActiveSection("dashboard")} />;
      default:
        return <DashboardContainer />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F6FC] font-poppins hide-scrollbar ">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onCreateWorkspace={() => setIsCreateModalOpen(true)}
        onJoinWorkspace={() => setIsJoinModalOpen(true)}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col h-[900px] relative">
        <TopBar 
          title={{
            dashboard: "Dashboard",
            search: "Search",
            notification: "Notification",
            events: "Meeting",
            files: "File Sharing",
            "create team": "Create Team",
            profile: "Profile Settings",
          }[activeSection] || "Dashboard"}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1  overflow-y-auto relative bg-[#FEFEFE]">
          {renderSection()}
          <div
            className="absolute inset-0 w-full h-full bg-no-repeat bg-bottom bg-contain opacity-80 pointer-events-none"
            style={{ backgroundImage: `url(${dashboardBg})` }}
          />

          {/* Modal overlays positioned relative to main content only */}
          {isCreateModalOpen && (
            <div 
              className="absolute inset-0 z-50 flex items-center justify-center"
              style={{
                background: 'rgba(14, 18, 25, 0.30)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <CreateWorkspaceModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
              />
            </div>
          )}
          {isJoinModalOpen && (
            <div 
              className="absolute inset-0 z-50 flex items-center justify-center"
              style={{
                background: 'rgba(14, 18, 25, 0.30)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <JoinWorkspaceModal 
                isOpen={isJoinModalOpen} 
                onClose={() => setIsJoinModalOpen(false)} 
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default Dashboard;