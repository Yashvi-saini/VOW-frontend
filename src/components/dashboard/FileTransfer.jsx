import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllFiles, deleteFile } from '../../api/file';
import emptyFolderIcon from '../../assets/emptyfolder.svg';
import DeleteModal from '../common/DeleteModal';
import Toast from '../common/Toast';
import FilesTable from './dash-components/FilesTable';

const FileTransfer = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, fileId: null, fileName: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Get workspace info from Redux store
  const userState = useSelector((state) => state.user);
  const workspaceId = userState?.workspaceId;

  useEffect(() => {
    fetchFiles();
  }, []);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMoreMenu && !event.target.closest('.more-menu-container')) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

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



  const handleView = async (fileId) => {
    // Simple view functionality - you can enhance this as needed
    setToast({ 
      show: true, 
      type: 'info', 
      message: 'Opening file...' 
    });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
  };

  const handleDeleteClick = (fileId, fileName) => {
    setDeleteModal({ show: true, fileId, fileName });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteModal.fileId;
    const fileName = deleteModal.fileName;
    
    // Close modal immediately to remove overlay
    setDeleteModal({ show: false, fileId: null, fileName: '' });
    
    // Optimistic UI: remove the file locally
    setFiles((prev) => prev.filter((f) => (f?._id || f?.id || f?.s3FileId || f?.key || f?.uid) !== id));

    try {
      await deleteFile(id);
      
      // Show success message
      setToast({ 
        show: true, 
        type: 'success', 
        message: `"${fileName}" deleted successfully` 
      });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
    } catch (error) {
      console.error('Error deleting file:', error);
      
      // Show error message and refresh to get accurate state
      const errorMessage = error.message || 'Delete failed';
      setToast({ show: true, type: 'error', message: errorMessage });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
      
      // Refresh the file list to get accurate state
      fetchFiles();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, fileId: null, fileName: '' });
  };

  // Share workspace files functionality
  const handleShareWorkspace = () => {
    if (!workspaceId) {
      setToast({ 
        show: true, 
        type: 'error', 
        message: 'No workspace selected to share' 
      });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
      return;
    }

    // Show share dialog instead of immediately copying
    setShowShareDialog(true);
  };

  const handleCopyWorkspaceId = () => {
    const workspaceName = userState?.workspaceName || 'Workspace';
    
    // Copy workspace ID to clipboard
    navigator.clipboard.writeText(workspaceId).then(() => {
      setShowShareDialog(false);
      setToast({ 
        show: true, 
        type: 'success', 
        message: `${workspaceName} ID copied to clipboard!` 
      });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
    }).catch(() => {
      // Fallback: show workspace ID in alert
      setShowShareDialog(false);
      alert(`Copy this ${workspaceName} ID: ${workspaceId}`);
    });
  };

  // More menu functionality
  const handleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  const handleRefreshFiles = async () => {
    setShowMoreMenu(false);
    setToast({ 
      show: true, 
      type: 'info', 
      message: 'Refreshing files...' 
    });
    await fetchFiles();
    setToast({ 
      show: true, 
      type: 'success', 
      message: 'Files refreshed' 
    });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
  };

  const handleExportFileList = () => {
    setShowMoreMenu(false);
    
    if (filteredFiles.length === 0) {
      setToast({ 
        show: true, 
        type: 'error', 
        message: 'No files to export' 
      });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
      return;
    }

    // Create CSV content
    const csvContent = [
      'File Name,Uploaded By,Upload Date,File Size',
      ...filteredFiles.map(file => {
        const name = getDisplayName(file).replace(/,/g, ';'); // Replace commas to avoid CSV issues
        const uploader = getUploadedBy(file).replace(/,/g, ';');
        const date = getFileDate(file) ? new Date(getFileDate(file)).toLocaleDateString() : 'Unknown';
        const size = file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown';
        return `${name},${uploader},${date},${size}`;
      })
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workspace-files-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToast({ 
      show: true, 
      type: 'success', 
      message: 'File list exported successfully' 
    });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
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
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const diffTime = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);

      // Future dates
      if (diffTime < 0) {
        return date.toLocaleDateString();
      }
      
      // Recent times
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffWeeks < 4) return `${diffWeeks}w ago`;
      if (diffMonths < 12) return `${diffMonths}mo ago`;
      
      // Older dates - show actual date
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    } catch (error) {
      console.warn('Error formatting date:', dateString, error);
      return 'Invalid date';
    }
  };

  return (
  <div className="relative h-full flex flex-col bg-gray-50 m-15 mt-10">
      {/* Blur overlay for content area when share dialog is open */}
      {showShareDialog && (
        <div className="absolute inset-0 backdrop-blur-sm bg-white/20 z-40 pointer-events-none"></div>
      )}
      
      {/* Search and Upload Section (Header lives in Topbar) */}
      <div className="bg-white pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 ">
            <input
              type="text"
              placeholder="Search by file name, software, tag, or keyword"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg
              className=" h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Share Workspace Button */}
            <button 
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              onClick={handleShareWorkspace}
              title="Share Workspace"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            
            {/* More Options Menu */}
            <div className="relative more-menu-container">
              <button 
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                onClick={handleMoreMenu}
                title="More Options"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="py-1">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={handleRefreshFiles}
                    >
                      <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh Files
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={handleExportFileList}
                    >
                      <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m-4-9h4a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2h4z" />
                      </svg>
                      Export File List
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <div className="px-4 py-2 text-xs text-gray-500">
                      {filteredFiles.length} files • {files.length} total
                    </div>
                  </div>
                </div>
              )}
            </div>
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
            <p className="text-gray-500 mb-6">Files shared by workspace members will appear here</p>
          </div>
        ) : (
          <FilesTable
            files={filteredFiles}
            onView={handleView}
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

      {/* Toast notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={
              `flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm ` +
              (toast.type === 'success'
                ? 'bg-green-600 text-white'
                : toast.type === 'error'
                ? 'bg-red-600 text-white'
                : toast.type === 'warning'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-900 text-white')
            }
          >
            {toast.type === 'success' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            ) : toast.type === 'error' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            ) : toast.type === 'warning' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            ) : (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle><path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4"></path></svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Share Workspace Dialog */}
      {showShareDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Close dialog when clicking on overlay (not on the modal content)
            if (e.target === e.currentTarget) {
              setShowShareDialog(false);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 relative z-10 overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Share Workspace</h3>
                <button 
                  onClick={() => setShowShareDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="px-6 py-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={userState?.workspaceName || 'Unnamed Workspace'}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 cursor-not-allowed"
                  placeholder="Enter workspace name"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace ID
                </label>
                <input
                  type="text"
                  value={workspaceId}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono text-sm cursor-not-allowed"
                  placeholder="Workspace ID"
                />
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                Share this workspace ID with others to invite them to join your workspace.
              </p>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowShareDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCopyWorkspaceId}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                Copy ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileTransfer;
