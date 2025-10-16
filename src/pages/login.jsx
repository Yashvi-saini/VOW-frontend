import React, { useState } from 'react';
import logo from '../assets/logo.png';
import X from '../assets/X.png';
import Eye from '../assets/Eye.png';
import EyeOff from '../assets/Eyeoff.png';
import { Link } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [identifierError, setIdentifierError] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // ✅ Validation functions
  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);
  const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);

  const isEmail = (value) => value.includes('@');

  // ✅ Form Validity
  const isFormValid =
    identifier !== '' && !identifierError &&
    password !== '' && !passwordError;

  // ✅ Event Handlers
  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setIdentifier(value);

    if (value === '') {
      setIdentifierError(false);
      return;
    }

    if (isEmail(value)) {
      setIdentifierError(!validateEmail(value));
    } else {
      setIdentifierError(value.trim() === '');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(value !== '' && !validatePassword(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    // ✅ Add your actual login logic here
    alert('Login successful!');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-poppins"
      style={{
        background: 'linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)',
      }}
    >
      <div className="bg-white p-20 pt-10 rounded-xl shadow-xl w-full max-w-[570px] relative">
        {/* Close Button */}
        <button className="absolute top-5 right-10 text-gray-900 text-2xl">
          &times;
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-[32px] font-medium text-gray-900 mb-1">
          Welcome back
        </h2>
        <p className="text-center text-[16px] text-gray-600 mb-6">
          Do not have an account?{' '}
          <a href="#" className="text-purple-700 font-medium hover:underline">
            Sign up
          </a>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Identifier Field */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Username or Email:
            </label>
            <input
              type="text"
              value={identifier}
              onChange={handleIdentifierChange}
              placeholder="Enter your username or email"
              className={`w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                identifierError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-purple-600'
              }`}
              required
            />
            {identifierError && (
              <img
                src={X}
                alt="Invalid identifier"
                className="absolute right-3 top-9 h-5 w-5"
              />
            )}
            {identifierError && (
              <p className="text-red-600 text-xs mt-1">
                Invalid email or username.
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Password:
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
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

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9"
            >
              <img
                src={showPassword ? EyeOff : Eye}
                alt="Toggle visibility"
                className="h-5 w-5 opacity-80 hover:opacity-100 transition"
              />
            </button>

            {passwordError && (
              <p className="text-red-600 text-xs mt-1">
                Password must be at least 8 characters, including uppercase, lowercase, and a number.
              </p>
            )}
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm mb-6">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-4 w-4" />
              <span className="text-gray-900">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[#707070] hover:underline text-[14px]"
            >
              forgot password
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 rounded-md font-semibold transition ${
              isFormValid
                ? 'bg-[#450B7B] text-white hover:bg-[#3a0863]'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;




