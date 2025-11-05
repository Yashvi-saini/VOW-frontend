import React, { useState, useEffect } from 'react';
import { getAllFiles, uploadFile, downloadFile, deleteFile } from '../../api/file';
import emptyFolderIcon from '../../assets/emptyfolder.svg';
import DeleteModal from '../common/DeleteModal';
import Toast from '../common/Toast';
import FilesTable from './dash-components/FilesTable';

const FileTransfer = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, fileId: null, fileName: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      console.log('Fetching files...');
      const filesData = await getAllFiles();
      console.log('Files response:', filesData);

      // Handle different response structures
      const filesList = filesData.files || filesData.data || filesData || [];
      console.log('Parsed files list:', filesList);

      setFiles(Array.isArray(filesList) ? filesList : []);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      console.log('Starting file upload:', file.name);
      // Show non-blocking toast while uploading
      setToast({ show: true, type: 'info', message: 'Uploading…' });
      const result = await uploadFile(file);
      console.log('Upload successful:', result);

      await fetchFiles(); // Refresh the file list
      event.target.value = ''; // Reset file input
      // Success toast
      setToast({ show: true, type: 'success', message: 'Uploaded successfully' });
      // Auto-hide success
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800);
    } catch (error) {
      console.error('Error uploading file:', error);
      setToast({ show: true, type: 'error', message: 'Upload failed' });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileId) => {
    try {
      await downloadFile(fileId);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleDeleteClick = (fileId, fileName) => {
    setDeleteModal({ show: true, fileId, fileName });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteModal.fileId;
    // Close modal immediately to remove overlay
    setDeleteModal({ show: false, fileId: null, fileName: '' });
    // Optimistic UI: remove the file locally
    setFiles((prev) => prev.filter((f) => (f?._id || f?.id || f?.s3FileId || f?.key || f?.uid) !== id));

    try {
      await deleteFile(id);
    } catch (error) {
      console.error('Error deleting file:', error);
      // If an error occurs but file is actually deleted, ensure UI stays consistent
      fetchFiles();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, fileId: null, fileName: '' });
  };

  // Helpers to normalize API differences
  const getDisplayName = (file) => file?.originalName || file?.filename || file?.name || 'File';

  const getUploadedBy = (file) =>
    (typeof file?.uploadedBy === 'string' && file?.uploadedBy) ||
    file?.uploadedBy?.fullName ||
    file?.uploaderName ||
    file?.owner ||
    '—';

  const getFileId = (file) => file?._id || file?.id || file?.s3FileId || file?.key || file?.uid;

  const getFileDate = (file) => file?.uploadedAt || file?.createdAt || file?.updatedAt || null;

  // When search is empty, don't filter out items that lack specific fields
  const filteredFiles = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return files;
    return files.filter((file) => {
      const name = getDisplayName(file).toLowerCase();
      const uploader = getUploadedBy(file).toLowerCase();
      return name.includes(q) || uploader.includes(q);
    });
  }, [files, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const [toast, setToast] = useState({ show: false, type: 'info', message: '' });

  return (
  <div className="relative h-full flex flex-col bg-gray-50">
      {/* Search and Upload Section (Header lives in Topbar) */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by file name, software, tag, or keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Upload Button */}
          <div className="relative">
            <label
              htmlFor="file-upload"
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>

          {/* Action Icons (placeholders) */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Files Content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="mb-6">
              <img src={emptyFolderIcon} alt="Empty folder" className="h-24 w-24 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No Shared Files Yet</h3>
            <p className="text-gray-500 mb-6">Upload your first file to get started with centralized file sharing</p>
            <label
              htmlFor="file-upload-empty"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
            >
              Upload First File
            </label>
            <input
              id="file-upload-empty"
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>
        ) : (
          <FilesTable
            files={filteredFiles}
            onView={handleDownload}
            onDelete={handleDeleteClick}
            getDisplayName={getDisplayName}
            getUploadedBy={getUploadedBy}
            getFileId={getFileId}
            getFileDate={getFileDate}
            formatDate={formatDate}
          />
        )}
      </div>

      <DeleteModal
        open={deleteModal.show}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        scopeSelector="main"
      />

      <Toast show={toast.show} type={toast.type} message={toast.message} />

      {/* Lightweight toast for upload status */}
      {toast.show && (
  <div className="fixed bottom-6 right-6 z-60">
          <div
            className={
              `flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm ` +
              (toast.type === 'success'
                ? 'bg-green-600 text-white'
                : toast.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-gray-900 text-white')
            }
          >
            {toast.type === 'success' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            ) : toast.type === 'error' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            ) : (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle><path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4"></path></svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileTransfer;
