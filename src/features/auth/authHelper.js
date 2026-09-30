import api from "../api/axiosConfig";

// ================= TOKEN =================

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("accessToken");
};

// Set token
export const setToken = (token) => {
  localStorage.setItem("accessToken", token);
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem("accessToken");
};

// ================= AUTH CHECK =================

export const isAuthenticated = () => {
  return !!getToken();
};

// ================= LOGOUT =================

export const logout = async () => {
  try {
    await api.post("auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    removeToken();
    window.location.href = "/login";
  }
};

// ================= AXIOS HELPER =================

// Attach token automatically
export const attachTokenToAxios = () => {
  const token = getToken();

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};