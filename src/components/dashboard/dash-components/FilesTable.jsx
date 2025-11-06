import React from 'react';

const FilesTable = ({
  files,
  onView,
  onDelete,
  getDisplayName,
  getUploadedBy,
  getFileId,
  getFileDate,
  formatDate,
}) => {
  return (
    <div className="h-full overflow-auto">
      {/* Table Header */}
      <div className="bg-purple-700 text-white px-4 py-3 grid grid-cols-12 gap-4 text-sm font-medium">
        <div className="col-span-4">File Name</div>
        <div className="col-span-3">Uploaded By</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-2 text-center">Action</div>
      </div>

      {/* Table Body */}
      <div className="bg-white">
        {files.map((file, index) => (
          <div
            key={getFileId(file) || index}
            className="px-4 py-3 grid grid-cols-12 gap-4 text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="col-span-4 flex items-center">
              <svg className="h-5 w-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-gray-900 truncate">{getDisplayName(file)}</span>
            </div>
            <div className="col-span-3 text-gray-600 truncate">{getUploadedBy(file)}</div>
            <div className="col-span-3 text-gray-600">{getFileDate(file) ? formatDate(getFileDate(file)) : '-'}</div>
            <div className="col-span-2 flex items-center justify-center gap-2">
              {file?.url ? (
                <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 font-medium">
                  View
                </a>
              ) : (
                <button onClick={() => onView(getFileId(file))} className="text-blue-500 hover:text-blue-700 font-medium">
                  View
                </button>
              )}
              <button
                onClick={() => onDelete(getFileId(file), getDisplayName(file))}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesTable;
