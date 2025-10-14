import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; 
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      alert('Please enter the 6-digit code');
      return;
    }

    navigate('/reset-password');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-poppins"
      style={{
        background: 'linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)',
      }}
    >
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">
        {/* Close button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">
          &times;
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-[24px] font-semibold text-gray-900 mb-1">
          Verify Your Email
        </h2>

        <p className="text-center text-sm text-[#707070] mb-6">
          Please enter the code sent to your email
        </p>

        {/* OTP Inputs */}
        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#450B7B] text-white py-3 rounded-md font-semibold hover:bg-[#3a0863] transition mb-3"
          >
            Verify
          </button>

          {/* Resend OTP */}
          <p className="text-center text-sm text-[#707070]">
            <button
              type="button"
              className="text-purple-700 font-medium hover:underline"
              style={{color:'#707070'}}
              onClick={() => alert('OTP Resent')}
            >
              Resend otp
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;

