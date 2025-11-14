// utils/auth.js
// Helper function to get cookie by name
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!getCookie('accessToken');
};

// Helper function to logout
export const logout = async () => {
  try {
    await api.post("auth/logout");
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear all client-side storage
    localStorage.clear();
    // Redirect to login
    window.location.href = '/login';
  }
};