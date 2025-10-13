import React from 'react';

const ResetSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Password Reset Successful</h2>
        <p className="text-gray-600 mb-6">You can now log in with your new password.</p>
        <a
          href="/login"
          className="inline-block bg-purple-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-purple-800"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default ResetSuccess;
