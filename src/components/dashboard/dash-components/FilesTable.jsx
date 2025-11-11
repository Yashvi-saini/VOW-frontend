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
    <div className=" mt-8">
      {/* Table Header */}
    <div className="grid grid-cols-14 w-full bg-[#5C0EA4] text-white px-6 py-2 rounded-xl ">
  <div className="text-left col-span-8">File Name</div>
  <div className="text-center col-span-2">Uploaded By</div>
  <div className="text-center col-span-3">Time</div>
  <div className="text-center col-span-1">Action</div>
</div>

      {/* Table Body */}
      <div className="bg-white ">
  {files.map((file, index) => (
    <div
      key={getFileId(file) || index}
      className="px-4 py-3 grid grid-cols-14 gap-4 text-sm border-b border-none rounded-lg my-2 shadow-sm hover:bg-gray-50 transition-colors"
    >
      {/* File Name (icon + text) */}
      <div className="col-span-8 flex items-center gap-2 truncate">
        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-gray-900 truncate font-medium text-[16px]">{getDisplayName(file)}</span>
      </div>

      {/* Uploaded By */}
      <div className="col-span-2 text-gray-600 truncate text-center font-medium text-[#707070] text-[16px]">
        {getUploadedBy(file)}
      </div>

      {/* Date */}
      <div className="col-span-3 text-gray-600 text-center font-medium  text-[16px]">
        {getFileDate(file) ? formatDate(getFileDate(file)) : '-'}
      </div>

      {/* Action buttons (View + Delete) */}
      <div className="col-span-1 flex items-center rounded-lg text-[16px] px-3 py-1 shadow-[0_0_2px_0_rgba(92,14,164,0.20)]">
        {file?.url ? (
          <a href={file.url} target="_blank" rel="noreferrer"
             className="text-[#5C0EA4] hover:text-blue-700 font-medium ">
            View
          </a>
        ) : (
          <button onClick={() => onView(getFileId(file))}
            className="text-[#5C0EA4] hover:text-blue-700 font-medium">
            View
          </button>
        )}

        <button
          onClick={() => onDelete(getFileId(file), getDisplayName(file))}
          className="text-red-500 hover:text-red-700"
          title="Delete file"
        >
          
        </button>
      </div>

    </div>
  ))}
</div>

    </div>
  );
};

export default FilesTable;
