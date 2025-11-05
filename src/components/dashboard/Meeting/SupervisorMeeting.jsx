import React from "react";
import MeetingForm from "./Meetingform";

const SupervisorMeeting = () => {
  const audienceOptions = [
    { id: "entire", label: "Entire Team" },
    { id: "individual", label: "Individual Member(s)" },
  ];

  return <MeetingForm role="supervisor" audienceOptions={audienceOptions} />;
};

export default SupervisorMeeting;
