import React, { useEffect, useState } from 'react';

const DeleteModal = ({ open, onCancel, onConfirm, scopeSelector = 'main' }) => {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!open) return;

    const compute = () => {
      const scope = document.querySelector(scopeSelector) || document.body;
      const r = scope.getBoundingClientRect();
      setRect({ left: r.left, top: r.top, width: r.width, height: r.height });
    };

    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('scroll', compute, true);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
    };
  }, [open, scopeSelector]);

  if (!open) return null;

  return (
    <>
      {/* blurred backdrop  */}
      <div
        className="fixed z-50"
        style={{
          left: rect?.left ?? 0,
          top: rect?.top ?? 0,
          width: rect?.width ?? '100vw',
          height: rect?.height ?? '100vh',
          background: 'rgba(14, 18, 25, 0.30)',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Centered modal within the scoped rectangle */}
      <div
        className="fixed z-50 flex items-center justify-center"
        style={{
          left: rect?.left ?? 0,
          top: rect?.top ?? 0,
          width: rect?.width ?? '100vw',
          height: rect?.height ?? '100vh'
        }}
      >
        <div className="relative w-[772px] max-w-[90vw] rounded-2xl bg-[#EFE7F6] px-8 py-6 ">
          {/* Close (X) */}
          <button
            aria-label="Close"
            onClick={onCancel}
            className="absolute right-3 top-3 rounded-full p-2 hover:bg-black/5"
          >
            <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center text-center w-full">
            <h3 className="mt-2 text-[36px] font-bold text-[#000] ">Delete this file?</h3>
            <p className="mt-3 text-[#0E1219] text-[20px]">
              Are you sure you want to <span className="text-[#CC0404] font-medium">delete this file ?</span>
            </p>
            <p className="mt-1 text-[#0E1219] text-[20px]">This action <span className="text-[#CC0404] font-medium">cannot be undone.</span></p>

            <div className="mt-6 mb-1 flex items-center justify-center gap-4 w-full">
              <button
                onClick={onCancel}
                className="h-10 min-w-[140px] px-6 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="h-10 min-w-[140px] px-6 rounded-lg bg-[#E53935] text-white hover:bg-[#D32F2F] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
