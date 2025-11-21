import api from "./axiosConfig";

export const registerUser = (data) => api.post("auth/register", data);
export const loginUser = (data) => api.post("auth/login", data);
export const verifyEmail = (data) => api.post("auth/verifyemail", data);
export const resendOtp = (data) => api.post("auth/resend", data);
export const forgotPassword = (data) => api.post("auth/forgetpassword", data);
export const resetPassword = (newPassword) => api.post("auth/updatepassword", { newPassword });
export const verifyResetOtp = (data) => api.post("auth/verifyresetotp", data);
export const refreshTokens = () => api.post("auth/refresh"); 
export const createWorkspace = (data) => {
  // Server will set workspaceToken_<id> as HttpOnly cookie
  return api.post("workspaces/create", data);
};

export const joinWorkspace = (inviteCode) => {
 
  return api.post("workspaces/join", { inviteCode }, );
};

export const getJoinedWorkspaces = () => {
  return api.get("/workspaces/details");
};

export const rejoinWorkspace = (workspaceId) => {
  // Use user access token to authenticate; server refreshes workspace cookie

  return api.get(`/workspaces/${workspaceId}/rejoin`, );
};

export const deleteWorkspace = (workspaceId) => {
  // Use user access token; workspace cookie will also be sent automatically
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Missing access token.");
  return api.delete(`/workspaces/${workspaceId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const getMembers = (workspaceId) => {
  // Workspace cookie (HttpOnly) will be sent automatically
  return api.get(`/workspaces/${workspaceId}/members`);
};

export const createChannel = (data) => {
  // Rely on workspace cookie
  return api.post("/channels", data);
};

// Rename a channel by id
export const renameChannel = (channelId, name) => {
  // Workspace cookie should authorize this like other channel endpoints
  return api.put(`/channels/${channelId}`, { name });
};


export const sendMessageToChannel = (channelId, content, attachments = []) => {
  const token = localStorage.getItem("accessToken");
  return api.post(`/messages`, {
    channelId,
    content,
    attachments,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchChannelMessages = (channelId) => {
  const token = localStorage.getItem("accessToken");
  return api.get(`/messages/channel/${channelId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getChannels = async (workspaceId) => {
  return api.get(`/channels/workspace/${workspaceId}`);
};

export const deleteChannelMessage = (messageId) => {
  const token = localStorage.getItem("accessToken");

  return api.delete(`/messages/message/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createTeam = (workspaceId, payload) => {
  return api.post(`/manager/team/create/${workspaceId}`, payload);
};

// Retrieve or ensure a direct workspace/context for two users (GET, no body)
export const getWorkspaceForUsers = (user1Id, user2Id) => {
  const token = localStorage.getItem("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return api.get(`/workspace/${user1Id}/${user2Id}`, { headers });
};

// Assign supervisor (lead) to existing team
export const assignTeamLead = (workspaceId, teamId, leadId) => {
  const token = localStorage.getItem("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return api.put(`/manager/team/assign-lead/${workspaceId}/${teamId}`, { leadId }, { headers });
};

// Fetch all teams for a workspace
export const getTeams = (workspaceId) => {
  const token = localStorage.getItem("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  // Updated endpoint to fetch all teams per new spec
  return api.get(`/manager/team/all/${workspaceId}`, { headers });
};

// Rename a team
export const renameTeam = (workspaceId, teamId, newName) => {
  const token = localStorage.getItem("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  // API expects { newName: "string" }
  return api.put(`/manager/team/rename/${workspaceId}/${teamId}`, { newName }, { headers });
};

// Schedule a meeting in a workspace
export const scheduleMeeting = (workspaceId, body) => {
  const token = localStorage.getItem("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return api.post(`/meeting/schedule/${workspaceId}`, body, { headers });
};
// Logout (POST) - clears server-side session/cookies
export const logoutUser = () => api.post("auth/logout");

export const getAllMeetings = () => {
  const token = localStorage.getItem("accessToken");
  return api.get("/meeting/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Direct Messages API
export const getDirectMessages = (workspaceId, user1, user2, params = {}) => {
  const token = localStorage.getItem("accessToken");
  const queryParams = new URLSearchParams(params).toString();
  return api.get(`/dm/${workspaceId}/${user1}/${user2}${queryParams ? `?${queryParams}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteDirectMessage = (messageId) => {
  const token = localStorage.getItem("accessToken");
  return api.delete(`/dm/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
