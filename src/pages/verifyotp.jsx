import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert('Please enter a 6-digit OTP');
      return;
    }

//verification

    navigate('/reset-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Verify OTP</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">Check your email and enter the 6-digit code.</p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded-md font-semibold hover:bg-purple-800 mb-3"
          >
            Verify
          </button>

          <button
            type="button"
            className="w-full text-purple-700 font-semibold text-sm hover:underline"
            onClick={() => alert('OTP Resent')}
          >
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
