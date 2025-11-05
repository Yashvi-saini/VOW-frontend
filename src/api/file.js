import api from "./axiosConfig";

export const getAllFiles = async () => {
  try {
    const res = await api.get("/files");
    console.log('Get files response:', res.data);
    return res.data;
  } catch (error) {
    console.error(" Error fetching files:", error.response?.data || error.message);
    throw error;
  }
};

export const uploadFile = async (file) => {
  try {
    if (!file) throw new Error("No file selected");

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Check for successful status codes (200-299)
    if (res.status >= 200 && res.status < 300) {
      return res.data.file || res.data;
    }
    
    // If not successful, check for error message
    if (!res.data.success) throw new Error(res.data.msg || "Upload failed");
    return res.data.file;
  } catch (error) {
    console.error(" Error uploading file:", error.response?.data || error.message);
    throw error;
  }
};

export const downloadFile = async (id) => {
  try {
    const res = await api.get(`/files/download/${id}`);
    const { url } = res.data;

    if (!url) throw new Error("Download URL not found");

    const link = document.createElement("a");
    link.href = url;
    link.download = ""; 
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(" Error downloading file:", error.response?.data || error.message);
    throw error;
  }
};
/*deleting file*/ 
export const deleteFile = async (id) => {
  try {
    const res = await api.delete(`/files/delete/${id}`);
    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }
    if (res.data && res.data.success === false) {
      throw new Error(res.data.msg || "Delete failed");
    }
    throw new Error("Delete failed");
  } catch (error) {
    console.error(" Error deleting file:", error.response?.data || error.message);
    throw error;
  }
};


