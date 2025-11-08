import api from "./axiosConfig";

// Helper function to get workspace ID from localStorage or other sources
export const getCurrentWorkspaceId = () => {
  try {
    // Try to get from localStorage first (set when user joins workspace)
    const workspaceId = localStorage.getItem('workspaceId') || localStorage.getItem('currentWorkspaceId');
    if (workspaceId && workspaceId !== 'null') {
      console.log('Found workspace ID in localStorage:', workspaceId);
      return workspaceId;
    }
    
    // Try to get from Redux store if available
    if (typeof window !== 'undefined' && window.store) {
      const state = window.store.getState();
      const reduxWorkspaceId = state.user?.workspaceId || state.workspace?.id;
      if (reduxWorkspaceId) {
        console.log('Found workspace ID in Redux:', reduxWorkspaceId);
        return reduxWorkspaceId;
      }
    }
    
    console.warn('No workspace ID found in localStorage or Redux store');
    return null;
  } catch (error) {
    console.warn('Could not get workspace ID:', error);
    return null;
  }
};

// Wrapper for uploadFile that automatically gets workspace ID
export const uploadFileToWorkspace = async (file, workspaceId = null) => {
  const targetWorkspaceId = workspaceId || getCurrentWorkspaceId();
  if (!targetWorkspaceId) {
    throw new Error("No workspace selected. Please join or select a workspace first.");
  }
  return uploadFile(file, targetWorkspaceId);
};

// Get all files from workspaces joined by the current user
export const getAllFiles = async () => {
  try {
    const res = await api.get("/files/all/joined");
    console.log('Get all workspace files response:', res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching workspace files:", error.response?.data || error.message);
    throw error;
  }
};

// Upload file to specific workspace
export const uploadFile = async (file, workspaceId) => {
  try {
    if (!file) throw new Error("No file selected");
    if (!workspaceId) throw new Error("Workspace ID is required");

    console.log(`Uploading file "${file.name}" to workspace: ${workspaceId}`);

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/files/${workspaceId}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000, // 60 second timeout for large files
    });

    console.log('Upload response:', res.status, res.data);

    // Check for successful status codes (201 for creation, or 200-299)
    if (res.status >= 200 && res.status < 300) {
      return res.data.file || res.data;
    }
    
    // If not successful, check for error message
    if (!res.data.success) throw new Error(res.data.message || res.data.msg || "Upload failed");
    return res.data.file;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.response?.data?.msg || error.message;
    console.error("Error uploading file:", errorMsg, error.response?.status);
    
    // Handle specific error codes
    if (error.response?.status === 400) {
      throw new Error("No file uploaded or unsupported file type");
    } else if (error.response?.status === 403) {
      throw new Error("You are not a member of this workspace");
    } else if (error.response?.status === 413) {
      throw new Error("File too large. Please choose a smaller file.");
    } else if (error.response?.status === 415) {
      throw new Error("File type not supported");
    } else if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }
    
    throw new Error(errorMsg || "Upload failed");
  }
};

export const downloadFile = async (id) => {
  try {
    console.log(`Downloading file with ID: ${id}`);
    
    const res = await api.get(`/files/download/${id}`);
    console.log('Download response:', res.data);
    
    const { url, filename } = res.data;

    if (!url) throw new Error("Download URL not found in server response");

    // Create download link
    const link = document.createElement("a");
    link.href = url;
    if (filename) {
      link.download = filename;
    }
    link.target = "_blank";
    link.style.display = "none";
    
    document.body.appendChild(link);
    
    // Add a small delay to ensure the link is properly added to DOM
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
    }, 100);
    
    console.log('Download initiated successfully');
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.response?.data?.msg || error.message;
    console.error("Error downloading file:", errorMsg, error.response?.status);
    
    // Handle specific error codes
    if (error.response?.status === 403) {
      throw new Error("You are not authorized to download this file");
    } else if (error.response?.status === 404) {
      throw new Error("File not found or has been deleted");
    } else if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later");
    }
    
    throw new Error(errorMsg || "Failed to download file");
  }
};
// Delete file (Uploader, Manager, or Admin only)
export const deleteFile = async (id) => {
  try {
    if (!id) throw new Error("File ID is required");

    console.log(`Deleting file with ID: ${id}`);

    const res = await api.delete(`/files/delete/${id}`);
    
    console.log('Delete response:', res.status, res.data);

    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }
    
    if (res.data && res.data.success === false) {
      throw new Error(res.data.message || res.data.msg || "Delete failed");
    }
    
    throw new Error("Delete failed");
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.response?.data?.msg || error.message;
    console.error("Error deleting file:", errorMsg, error.response?.status);
    
    // Handle specific error codes
    if (error.response?.status === 403) {
      throw new Error("You are not authorized to delete this file. Only the uploader, workspace manager, or admin can delete files.");
    } else if (error.response?.status === 404) {
      throw new Error("File not found. It may have already been deleted.");
    } else if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }
    
    throw new Error(errorMsg || "Delete failed");
  }
};


