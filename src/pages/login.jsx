import React, { useState } from 'react';
import logo from '../assets/logo.png';
import eyeIcon from '../assets/Eye.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (value) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!validateEmail(value));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-poppins"
     style={{
    background: 'linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)'
  }}
    >
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">
        
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">
          &times;
        </button>

        {/* Use local logo image */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        <h2 className="text-center text-[32px] font-medium text-gray-900 mb-1">
          Welcome back
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Do not have an account?{' '}
          <a href="#" className="text-purple-700 font-medium hover:underline">
            Sign up
          </a>
        </p>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                emailError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-purple-600'
              }`}
              required
            />
            {emailError && (
              <p className="text-red-600 text-xs mt-1">Invalid credential</p>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Password:
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            {/* Use eye icon from assets */}
            <img
                src={eyeIcon}
              alt={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-9 h-5 w-5 cursor-pointer select-none"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="flex items-center justify-between text-sm mb-6">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-4 w-4" />
              <span className="text-gray-900">Remember me</span>
            </label>
            <a href="#" className="text-purple-700 hover:underline text-sm">
              forgot password
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#450B7B] text-white py-3 rounded-md font-semibold hover:bg-[#3a0863] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
