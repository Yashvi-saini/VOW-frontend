import api from "./axiosConfig";

export const registerUser = (data) => api.post("auth/register", data);
export const loginUser = (data) => api.post("auth/login", data);
export const verifyEmail = (data) => api.post("auth/verifyemail", data);
export const resendOtp = (data) => api.post("auth/resend", data);
export const forgotPassword = (data) => api.post("auth/forgetpassword", data);
export const resetPassword = (newPassword) => api.post("auth/updatepassword", { newPassword });
export const verifyResetOtp = (data) => api.post("auth/verifyresetotp", data);

export const createWorkspace = (data) => {
  // Server will set workspaceToken_<id> as HttpOnly cookie
  return api.post("workspaces/create", data);
};

export const joinWorkspace = (inviteCode) => {
  const token = localStorage.getItem("accessToken");
  return api.post("workspaces/join", { inviteCode }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getJoinedWorkspaces = () => {
  const token = localStorage.getItem("accessToken");
  return api.get("/workspaces/details", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const rejoinWorkspace = (workspaceId) => {
  // Use user access token to authenticate; server refreshes workspace cookie
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Missing access token. Please log in again.");
  return api.get(`/workspaces/${workspaceId}/rejoin`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
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

export const createTeam = (workspaceId, payload) => {
  return api.post(`/manager/team/create/${workspaceId}`, payload);
};

// Logout (POST) - clears server-side session/cookies
export const logoutUser = () => api.post("auth/logout");