import api from "./axiosConfig";

// Get all meetings
export const getAllMeetings = () => {
  return api.get("/meeting/all");
};

// Schedule meeting
export const scheduleMeeting = (workspaceId, body) => {
  return api.post(`/meeting/schedule/${workspaceId}`, body);
};

// Update meeting
export const updateMeeting = (meetingId, body) => {
  return api.put(`/meeting/update/${meetingId}`, body);
};

// Delete meeting
export const deleteMeeting = (meetingId) => {
  return api.delete(`/meeting/${meetingId}`);
};