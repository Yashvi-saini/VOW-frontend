import React from "react";
import ManagerMeeting from "@/features/meetings/ManagerMeeting";
import SupervisorMeeting from "@/features/meetings/SupervisorMeeting";
import TeamMemberMeeting from "@/features/meetings/TeamMemberMeeting";

const MeetingSection = ({ role }) => {
  const renderView = () => {
    switch (role) {
      case "manager":
        return <ManagerMeeting />;
      case "supervisor":
        return <SupervisorMeeting />;
      default:
        return <TeamMemberMeeting />;
    }
  };

  return (
    <div className="relative z-10">
      {renderView()}
    </div>
  );
};

export default MeetingSection;

