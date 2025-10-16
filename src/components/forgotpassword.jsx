import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false); // track blur (focus loss)
  const [submitted, setSubmitted] = useState(false);
   const navigate = useNavigate();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched(true);
   if (!email || !isEmailValid) return ;
    navigate('/verify-otp');


    if (!email || !isEmailValid) return; // don’t submit if invalid or not

    console.log('Sending OTP to:', email);
    // TODO: send OTP API call
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-poppins"
      style={{
        background: 'linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)',
      }}
    >
      <div className="bg-white pt-5 p-10 rounded-2xl shadow-xl w-full max-w-[570px] relative pb-10 text-center box-border">
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            className="text-gray-800 font-bold text-3xl mt-1 mr-2 pr-1 text-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-6 sm:px-10 pb-10">
          {/* Logo */}
          <div className="flex justify-center mt-1">
            <img src="./logo.svg" alt="Logo" className="h-[35px] w-[51px]" />
          </div>

          {/* Heading */}
          <h2 className="text-center text-[32px] font-medium text-gray-900 mb-1">
            Forgot Password
          </h2>

          {/* Instruction */}
          <p className="text-center text-[17px] mb-8 text-gray-600">
            Please enter your registered email to receive a verification code.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="text-left">
            <div className="">
              <label className="block text-1xl font-bold text-gray-900 mb-1">
                Email:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Enter your email"
                  className={`w-full border rounded-lg px-2 py-2 text-[17px] focus:outline-none focus:ring-2 transition
                    ${
                      email
                        ? isEmailValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-[#5C0EA4] focus:ring-[#5C0EA4]'
                        : 'border-gray-400 focus:ring-[#5C0EA4]'
                    }`}
                />

                {/* Green tick icon */}
                {isEmailValid && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 absolute inset-y-0 right-2 m-auto text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              {/* Validation warning */}
              <p className="text-[#5C0EA4] text-sm mt-1 min-h-[20px]">
                {(touched || submitted) && (!email || !isEmailValid)
                  ? 'Enter a valid email (e.g., abc@domain.com)'
                  : ''}
              </p>
            </div>

            <button
              type="submit"
              disabled={!email || !isEmailValid}
              className={`w-full py-2 rounded-lg bg-[#450B7B] hover:bg-[#5d11a3] text-white font-normal text-[20px] mt-8 transition
                `}
            >
              Send
            </button>
          </form>

          {/* Back to login */}
          <p className=" text-center text-[17px] text-[#707070]">
            <a href="/login" className="font-normal underline">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
