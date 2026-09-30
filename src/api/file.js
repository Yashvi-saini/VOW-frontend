import api from "./axiosConfig";

export const getCurrentWorkspaceId = () => {
  try {
    const workspaceId = localStorage.getItem("workspaceId") || localStorage.getItem("currentWorkspaceId");
    if (workspaceId && workspaceId !== "null") {
      return workspaceId;
    }

    if (typeof window !== "undefined" && window.store) {
      const state = window.store.getState();
      const reduxWorkspaceId = state.user?.workspaceId || state.workspace?.id;
      if (reduxWorkspaceId) {
        return reduxWorkspaceId;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export const uploadFileToWorkspace = async (file, workspaceId = null) => {
  const targetWorkspaceId = workspaceId || getCurrentWorkspaceId();
  if (!targetWorkspaceId) {
    throw new Error("No workspace selected. Please join or select a workspace first.");
  }
  return uploadFile(file, targetWorkspaceId);
};

export const getAllFiles = async () => {
  try {
    const res = await api.get("/files/all/joined");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (file, workspaceId) => {
  try {
    if (!file) throw new Error("No file selected");
    if (!workspaceId) throw new Error("Workspace ID is required");

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`/files/${workspaceId}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });

    if (res.status >= 200 && res.status < 300) {
      return res.data.file || res.data;
    }

    if (!res.data.success) throw new Error(res.data.message || res.data.msg || "Upload failed");
    return res.data.file;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.response?.data?.msg || error.message;

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
    const res = await api.get(`/files/download/${id}`);
    const { url, filename } = res.data;

    if (!url) throw new Error("Download URL not found in server response");

    const link = document.createElement("a");
    link.href = url;
    if (filename) {
      link.download = filename;
    }
    link.target = "_blank";
    link.style.display = "none";

    document.body.appendChild(link);

    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.response?.data?.msg || error.message;

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

export const deleteFile = async (id) => {
  try {
    if (!id) throw new Error("File ID is required");

    const res = await api.delete(`/files/delete/${id}`);

    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }

    if (res.data && res.data.success === false) {
      throw new Error(res.data.message || res.data.msg || "Delete failed");
    }

    throw new Error("Delete failed");
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.response?.data?.msg || error.message;

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
