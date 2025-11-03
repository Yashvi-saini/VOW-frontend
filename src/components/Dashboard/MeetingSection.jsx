import React from "react";
import ManagerMeeting from "./Meeting/ManagerMeeting";
import SupervisorMeeting from "./Meeting/SupervisorMeeting";
import TeamMemberMeeting from "./Meeting/TeamMemberMeeting";

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

