import React, { useState } from "react";
import ChevronDown from "../../../assets/down.svg";
import Share2 from "../../../assets/shareicon.svg";
import Download from "../../../assets/download.png";
import DeleteIcon from "../../../assets/delete.svg";

const FilesTable = ({
  files,
  onView,
  onDelete,
  onShare,
  onDownload,
  getDisplayName,
  getUploadedBy,
  getFileId,
  getFileDate,
  formatDate,
}) => {
  const [openFileId, setOpenFileId] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const toggleFile = (id) => {
    setOpenFileId((prev) => (prev === id ? null : id));
    setSelectedFileId(id); // Set the selected file when clicked
  };

  const handleShare = (fileId, fileName) => {
    if (onShare) {
      onShare(fileId, fileName);
    }
  };

  const handleDownload = (fileId, fileName) => {
    if (onDownload) {
      onDownload(fileId, fileName);
    }
  };

  const handleDelete = (fileId, fileName) => {
    if (onDelete) {
      onDelete(fileId, fileName);
    }
  };

  // Get the currently selected file
  const getSelectedFile = () => {
    return files.find(file => getFileId(file) === selectedFileId);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedFileId(null);
  };

  return (
    <div className="mt-8 w-full">

      {/* ▶ Desktop Header */}
      <div className="hidden md:grid grid-cols-12 bg-[#5C0EA4] text-white px-6 py-3 rounded-xl items-center">
        <div className="col-span-5 text-left font-medium">File Name</div>
        <div className="col-span-3 text-center font-medium">Uploaded By</div>
        <div className="col-span-3 text-center font-medium">Time</div>
        <div className="col-span-1 text-center font-medium">Actions</div>
      </div>

      {/* ▶ Table Body */}
      <div className="bg-white rounded-lg mt-2 overflow-y-auto max-h-[500px] hide-scrollbar">
        {files.map((file, index) => {
          const fileId = getFileId(file);
          const isOpen = openFileId === fileId;

          return (
            <div
              key={fileId || index}
              className={`border-b border-gray-200 rounded-lg my-2 shadow-sm bg-white z-10 ${
                isOpen ? "ring-1 ring-[#5C0EA4]/30" : ""
              }`}
            >
              {/* ▶ Desktop Row */}
              <div 
                className="hidden md:grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50"
              >
                
                {/* File Name */}
                <div className="col-span-5 flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-blue-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="font-medium text-[16px] truncate">
                    {getDisplayName(file)}
                  </span>
                </div>

                {/* Uploaded By */}
                <div className="col-span-3 text-center text-gray-600 truncate px-2">
                  {getUploadedBy(file)}
                </div>

                {/* Time */}
                <div className="col-span-3 text-center text-gray-600 truncate px-2">
                  {getFileDate(file) ? formatDate(getFileDate(file)) : "-"}
                </div>

                {/* Actions - Fixed to prevent shrinking */}
                <div className="col-span-1 flex justify-center items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(fileId);
                    }}
                    className="text-[#5C0EA4] hover:text-blue-700 font-medium px-3 py-1 rounded hover:bg-purple-50 whitespace-nowrap"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(fileId, getDisplayName(file));
                    }}
                    className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 flex-shrink-0"
                    title="Delete"
                  >
                    <img src={DeleteIcon} className="w-6 h-6" alt="delete" />
                  </button>
                </div>
              </div>

              {/* ▶ Mobile Row */}
              <div 
                className="md:hidden flex justify-between items-center px-4 py-3 cursor-pointer"
                onClick={() => toggleFile(fileId)}
              >
                
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <svg
                    className="h-5 w-5 text-blue-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[16px] truncate">
                      {getDisplayName(file)}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {getUploadedBy(file)} • {getFileDate(file) ? formatDate(getFileDate(file)) : "-"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <img src={ChevronDown} className="w-5 h-5 rotate-180" alt="up" />
                  ) : (
                    <img src={ChevronDown} className="w-5 h-5" alt="down" />
                  )}
                </div>
              </div>

              {/* ▶ Mobile Expanded Section */}
              {isOpen && (
                <div className="md:hidden bg-[#F8FAFF] px-4 py-3 rounded-b-lg shadow-inner">
                  {/* Action buttons for mobile */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="flex items-center gap-2 bg-[#5C0EA4] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#4a0b85] flex-1 justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(fileId);
                      }}
                    >
                      View
                    </button>

                    <button
                      className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-50 border border-red-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(fileId, getDisplayName(file));
                      }}
                    >
                      <img src={DeleteIcon} className="w-6 h-6" alt="delete" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilesTable;