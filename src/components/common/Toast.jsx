import React from 'react';

const Toast = ({ show, type = 'info', message }) => {
  if (!show) return null;
  const base = 'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm';
  const tone =
    type === 'success' ? 'bg-green-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white';

  return (
    <div className="fixed bottom-6 right-6 z-60">
      <div className={`${base} ${tone}`}>
        {type === 'success' ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : type === 'error' ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
            <path className="opacity-75" d="M4 12a8 8 0 018-8" strokeWidth="4"></path>
          </svg>
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
