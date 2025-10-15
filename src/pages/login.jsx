import React, { useState } from 'react';
import logo from '../assets/logo.png';
import X from '../assets/X.png';
import { Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(value !== '' && !validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(value !== '' && !validatePassword(value));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-poppins"
      style={{
        background: 'linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)',
      }}
    >
      <div className="bg-white p-20 pt-10 rounded-xl shadow-xl w-full max-w-[570px] relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">
          &times;
        </button>

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
          {/* Email */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className={`w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                emailError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-purple-600'
              }`}
              required
            />
            {emailError && (
              <img
                src={X}
                alt="Invalid email"
                className="absolute right-3 top-9 h-5 w-5"
              />
            )}
            {emailError && (
              <p className="text-red-600 text-xs mt-1">Invalid email format</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className={`w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                passwordError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-purple-600'
              }`}
              required
            />
            {passwordError && (
              <img
                src={X}
                alt="Invalid password"
                className="absolute right-3 top-9 h-5 w-5"
              />
            )}
            {passwordError && (
              <p className="text-red-600 text-xs mt-1">
                Password must be 8+ chars, include uppercase, lowercase & number
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm mb-6">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-4 w-4" />
              <span className="text-gray-900">Remember me</span>
            </label>
               <Link to="/forgot-password" className="text-purple-700 hover:underline text-sm">
                   forgot password
              </Link>

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
