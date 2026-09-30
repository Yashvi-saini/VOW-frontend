import api from "./axiosConfig";

export const registerUser = (data) =>
  api.post("auth/register", data);

export const loginUser = async (data) => {
  const res = await api.post("auth/login", data);
  if (res.data?.accessToken) {
    localStorage.setItem("accessToken", res.data.accessToken);
  }
  if (res.data?.refreshToken) {
    localStorage.setItem("refreshToken", res.data.refreshToken);
  }
  return res.data;
};

export const logoutUser = async () => {
  try {
    await api.post("auth/logout");
  } catch (err) {
    console.error(err);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isLogged");
    window.location.href = "/login";
  }
};

export const isAuthenticated = () => true;

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

export const refreshTokens = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const res = await api.post("auth/refresh-token", {}, {
    headers: refreshToken ? { "x-refresh-token": refreshToken } : {}
  });
  if (res.data?.accessToken) {
    localStorage.setItem("accessToken", res.data.accessToken);
  }
  if (res.data?.refreshToken) {
    localStorage.setItem("refreshToken", res.data.refreshToken);
  }
  return res.data;
};