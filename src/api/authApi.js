import api from "./axiosConfig";
// signup
export const registerUser = (data) => api.post("auth/register", data);

// Login
export const loginUser = (data) => api.post("auth/login", data);

// Verify email (OTP)
export const verifyEmail = (data) => api.post("auth/verifyemail", data);

// Resend verification OTP
export const resendOtp = (data) => api.post("auth/resend", data);

// Forgot password
export const forgotPassword = (data) => api.post("auth/forgetpassword", data);

// Reset password
export const resetPassword = (newPassword) => api.post("auth/updatepassword", {newPassword});

export const verifyResetOtp = (data) => api.post("auth/verifyresetotp", data);

export const createWorkspace = (data) => {
  const token = localStorage.getItem("accessToken");
   console.log("Sending token:", token);
  return api.post("workspaces/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const joinWorkspace = (inviteCode) => {
  const token = localStorage.getItem("accessToken");
  return api.post("workspaces/join", { inviteCode }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const getJoinedWorkspaces = () => {
  return api.get("/workspaces/details"); // Replace with your actual endpoint
};


export const rejoinWorkspace = (workspaceId) => {
  const workspaceToken = localStorage.getItem("workspaceToken");

  return api.get("/workspaces/{workspaceId}/rejoin", {
    params: {
      workspaceId,
    },
    headers: {
      Authorization: `Bearer ${workspaceToken}`,
    },
  });
};





export const getMembers = (workspaceId, workspaceToken) => {
  return api.get(`/workspaces/{workspaceId}/members`, {
    params: {
      workspaceId,
      workspaceToken,
    },
  });
};