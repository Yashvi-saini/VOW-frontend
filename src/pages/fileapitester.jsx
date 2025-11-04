import React, { useState, useEffect } from "react";
import { getAllFiles, uploadFile, downloadFile, deleteFile } from "../api/file";

const FileTester = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all uploaded files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await getAllFiles();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Handle file select
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first!");
    try {
      await uploadFile(selectedFile);
      alert(" File uploaded successfully!");
      setSelectedFile(null);
      await fetchFiles(); // refresh list
    } catch (error) {
      console.error("Upload failed:", error);
      alert(" Upload failed. See console for details.");
    }
  };

  // Handle file download
  const handleDownload = async (id) => {
    try {
      await downloadFile(id);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // Handle file delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteFile(id);
      alert(" File deleted successfully!");
      await fetchFiles();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6"> File Manager Tester</h1>

      
      <div className="flex items-center gap-4 mb-8">
        <input
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded-md bg-white"
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Upload
        </button>
      </div>

    
      <button
        onClick={fetchFiles}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {loading ? "Refreshing..." : "Refresh Files"}
      </button>

      
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
        {files.length === 0 ? (
          <p className="text-gray-500 text-center">No files uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {files.map((file) => (
              <li
                key={file._id}
                className="flex justify-between items-center py-3"
              >
                <span className="truncate max-w-xs">{file.filename}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(file._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileTester;

