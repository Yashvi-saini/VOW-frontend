import api from "./axiosConfig";

/**
 * Get all meetings
 * @returns {Promise} - Array of meetings
 */
export const getAllMeetings = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.get("/meeting/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Get all meetings response:', res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching meetings:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Schedule a new meeting
 * @param {String} workspaceId - Workspace ID
 * @param {Object} meetingData - Meeting details (title, description, startTime, endTime, attendees)
 * @returns {Promise} - Created meeting object with _id
 */
export const scheduleMeeting = async (workspaceId, meetingData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.post(`/meeting/schedule/${workspaceId}`, meetingData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Schedule meeting response:', res.data);
    return res.data;
  } catch (error) {
    console.error("Error scheduling meeting:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update a meeting
 * @param {String} meetingId - Meeting ID (_id from meeting object)
 * @param {Object} updateData - Updated meeting details (title, description, startTime, endTime)
 * @returns {Promise} - Updated meeting object
 */
export const updateMeeting = async (meetingId, updateData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.put(`/meeting/update/${meetingId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Update meeting response:', res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating meeting:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete a meeting
 * @param {String} meetingId - Meeting ID (_id from meeting object)
 * @returns {Promise} - Deletion confirmation
 */
export const deleteMeeting = async (meetingId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.delete(`/meeting/${meetingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Delete meeting response:', res.data);
    return res.data;
  } catch (error) {
    console.error("Error deleting meeting:", error.response?.data || error.message);
    throw error;
  }
};
