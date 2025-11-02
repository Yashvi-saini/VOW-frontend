import api from "./axiosConfig";

// 🔐 Auth APIs
export const registerUser = (data) => api.post("auth/register", data);
export const loginUser = (data) => api.post("auth/login", data);
export const verifyEmail = (data) => api.post("auth/verifyemail", data);
export const resendOtp = (data) => api.post("auth/resend", data);
export const forgotPassword = (data) => api.post("auth/forgetpassword", data);
export const resetPassword = (newPassword) => api.post("auth/updatepassword", { newPassword });
export const verifyResetOtp = (data) => api.post("auth/verifyresetotp", data);

// 🏢 Workspace APIs
export const createWorkspace = (data) => {
  const token = localStorage.getItem("accessToken");
  return api.post("workspaces/create", data, {
    headers: { Authorization: `Bearer ${token}` },
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
  const workspaceToken = localStorage.getItem(`workspaceToken_${workspaceId}`);
  if (!workspaceToken) {
    throw new Error("Missing workspace token. Please join the workspace again.");
  }
  return api.get(`/workspaces/${workspaceId}/rejoin`, {
    headers: { Authorization: `Bearer ${workspaceToken}` },
  });
};

export const deleteWorkspace = (workspaceId) => {
  const workspaceToken = localStorage.getItem(`workspaceToken_${workspaceId}`);
  if (!workspaceToken) {
    throw new Error("No token found for this workspace");
  }
  return api.delete(`/workspaces/${workspaceId}`, {
    headers: { Authorization: `Bearer ${workspaceToken}` },
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

// 📺 Channel APIs
export const createChannel = (data) => {
  const workspaceToken = localStorage.getItem(`workspaceToken_${data.workspaceId}`);
  if (!workspaceToken) {
    throw new Error("Missing workspace token for channel creation.");
  }
  return api.post("/channels", data, {
    headers: { Authorization: `Bearer ${workspaceToken}` },
  });
};

// 💬 Message APIs
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