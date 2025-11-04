import React from "react";
import MeetingForm from "./Meetingform";

const ManagerMeeting = () => {
  const audienceOptions = [
    { id: "all", label: "All Teams" },
    { id: "specific", label: "Specific Team(s)" },
    { id: "supervisors", label: "Team Supervisors only" },
  ];

  return <MeetingForm role="manager" audienceOptions={audienceOptions} />;
};

export default ManagerMeeting;
