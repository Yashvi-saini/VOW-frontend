import api from "./axiosConfig";

export const getAllMeetings = () => {
  return api.get("/meeting/all");
};

export const scheduleMeeting = (workspaceId, body) => {
  return api.post(`/meeting/schedule/${workspaceId}`, body);
};

export const updateMeeting = (meetingId, body) => {
  return api.put(`/meeting/update/${meetingId}`, body);
};

export const deleteMeeting = (meetingId) => {
  return api.delete(`/meeting/${meetingId}`);
};