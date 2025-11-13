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
import MeetingPage from "./Meeting/meetingpage.jsx";
import GeminiChat from "../../../geminichat.jsx";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showGeminiChat, setShowGeminiChat] = useState(false);
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContainer />;
      case "search":
        return <SearchSection />;
      case "notification":
        return <NotificationSection />;
      case "events":
        return <MeetingPage/>;
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
    <div className="flex min-h-screen w-full bg-[#F8F6FC] font-poppins hide-scrollbar overflow-x-hidden ">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onCreateWorkspace={() => setIsCreateModalOpen(true)}
        onJoinWorkspace={() => setIsJoinModalOpen(true)}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
         onNeedHelp={() => setShowGeminiChat(true)}
      />
      
      {/* Full-screen blur overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Gemini Chat Modal */}
      {showGeminiChat && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <GeminiChat onClose={() => setShowGeminiChat(false)} />
        </div>
      )}
      
      <div className="flex-1 flex flex-col w-full min-w-0 relative min-h-screen">
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
        <main className="flex-1 relative bg-[#FEFEFE] w-full min-w-0 overflow-y-auto overflow-x-hidden">
          {renderSection()}
          <div
            className="absolute inset-0 w-full h-full bg-no-repeat bg-bottom bg-contain opacity-80 pointer-events-none"
            style={{ backgroundImage: `url(${dashboardBg})` }}
          />
        </main>
      </div>

      {/* Modal overlays positioned fixed to cover entire screen including topbar */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
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
          className="fixed inset-0 z-50 flex items-center justify-center"
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
    </div>
  );
};
export default Dashboard;