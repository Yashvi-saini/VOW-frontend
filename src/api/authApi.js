import api from "./axiosConfig";

export const registerUser = (data) => api.post("auth/register", data);
export const loginUser = (data) => api.post("auth/login", data);
export const verifyEmail = (data) => api.post("auth/verifyemail", data);
export const resendOtp = (data) => api.post("auth/resend", data);
export const forgotPassword = (data) => api.post("auth/forgetpassword", data);
export const resetPassword = (newPassword) => api.post("auth/updatepassword", { newPassword });
export const verifyResetOtp = (data) => api.post("auth/verifyresetotp", data);

export const createWorkspace = (data) => {

  return api.post("workspaces/create", data, {

  });
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
  // Prefer workspace-scoped token; fall back to user access token if not present
  const workspaceToken = localStorage.getItem(`workspaceToken_${workspaceId}`);
  const accessToken = localStorage.getItem("accessToken");
  const authToken = workspaceToken || accessToken;

  if (!authToken) {
    throw new Error("Missing tokens. Please join the workspace again.");
  }

  return api.get(`/workspaces/${workspaceId}/rejoin`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const deleteWorkspace = (workspaceId) => {
  // Prefer workspace-scoped token, but fall back to user access token if needed
  const workspaceToken = localStorage.getItem(`workspaceToken_${workspaceId}`);
  const accessToken = localStorage.getItem("accessToken");
  const authToken = workspaceToken || accessToken;

  if (!authToken) {
    throw new Error("No token found for this workspace or user");
  }

  return api.delete(`/workspaces/${workspaceId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export const getMembers = (workspaceId) => {
  const workspaceToken = localStorage.getItem(`workspaceToken_${workspaceId}`);
  if (!workspaceToken) {
    throw new Error("Missing workspace token. Please join or rejoin the workspace.");
  }
  return api.get(`/workspaces/${workspaceId}/members`, {
    headers: { Authorization: `Bearer ${workspaceToken}` },
  });
};

export const createChannel = (data) => {
  const workspaceToken = localStorage.getItem(`workspaceToken_${data.workspaceId}`);
  if (!workspaceToken) {
    throw new Error("Missing workspace token for channel creation.");
  }
  return api.post("/channels", data, {
    headers: { Authorization: `Bearer ${workspaceToken}` },
  });
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