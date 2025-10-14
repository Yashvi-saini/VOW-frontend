import React, { useState } from 'react';
//import { Link, useNavigate } from 'react-router-dom';

{
/*updated  logo position*/ 
}
// import logo from '../assets/logo.png';

 const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Sending OTP to:', email);
//     // Navigate to verify otp page after sending OTP
//     navigate('/verify-otp');
//   };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-poppins"
      style={{
        background: 'linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)',
      }}
    >
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="./logo.svg" alt="Logo" className="h-8" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-[28px] font-medium text-gray-900 mb-1">
          Forgot Password
        </h2>

        {/* Instruction text */}
        <p
          className="text-center text-sm mb-6"
          style={{ color: '#707070' }}
        >
          Please enter your registered email to receive a verification code.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#450B7B] text-white py-3 rounded-md font-semibold hover:bg-[#3a0863] transition"
          >
            Send OTP
          </button>
        </form>

        {/* Back to login */}
        <p className="mt-4 text-center text-sm" style={{ color: '#707070' }}>
          <Link to="/login" className="font-medium hover:underline text-purple-700">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;