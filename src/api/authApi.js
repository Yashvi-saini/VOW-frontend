import api from "./axiosConfig";

// ===== AUTH APIs =====

export const registerUser = (data) =>
  api.post("auth/register", data);

export const loginUser = async (data) => {
  const res = await api.post("auth/login", data);
  return res.data; // ✅ no token handling
};

export const logoutUser = async () => {
  try {
    await api.post("auth/logout");
  } catch (err) {
    console.error(err);
  } finally {
    window.location.href = "/login";
  }
};

// ✅ simple auth check (optional)
export const isAuthenticated = () => true;
// (real auth is handled by backend cookies)

// ===== PASSWORD / OTP =====

export const forgotPassword = (data) =>
  api.post("auth/forgetpassword", data);

export const verifyResetOtp = (data) =>
  api.post("auth/verifyresetotp", data);

export const resetPassword = (newPassword) =>
  api.post("auth/updatepassword", { newPassword });

export const verifyEmail = (data) =>
  api.post("auth/verifyemail", data);

export const resendOtp = (data) =>
  api.post("auth/resend", data);

export const refreshTokens = () =>
  api.post("auth/refresh");