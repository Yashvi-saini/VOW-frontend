import api from "./axiosConfig";
// signup
export const registerUser = (data) => api.post("/register", data);

// Login
export const loginUser = (data) => api.post("/login", data);

// Verify email (OTP)
export const verifyEmail = (data) => api.post("/verifyemail", data);

// Resend verification OTP
export const resendOtp = (data) => api.post("/resend", data);

// Forgot password
export const forgotPassword = (data) => api.post("/forgetpassword", data);

// Reset password
export const resetPassword = (data) => api.post("/resetpassword", data);
