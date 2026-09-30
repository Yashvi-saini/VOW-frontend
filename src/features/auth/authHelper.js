import api from "../api/axiosConfig";
export const getToken = () => {
  return localStorage.getItem("accessToken");
};
export const setToken = (token) => {
  localStorage.setItem("accessToken", token);
};
export const removeToken = () => {
  localStorage.removeItem("accessToken");
};

export const isAuthenticated = () => {
  return !!getToken();
};

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
export const attachTokenToAxios = () => {
  const token = getToken();

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};