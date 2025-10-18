import React, { useState } from 'react';
import logo from '../assets/logo.png';
import X from '../assets/X.png';
import Eye from '../assets/Eye.png';
import EyeOff from '../assets/Eyeoff.png';
import { Link,useNavigate } from 'react-router-dom';
import { loginUser } from "../api/authApi";



const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [identifierError, setIdentifierError] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  //  Validation functions
  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const validatePassword = (value) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      value
    );

  const isEmail = (value) => value.includes('@');

  const isFormValid =
    identifier !== '' &&
    !identifierError &&
    password !== '' &&
    !passwordError;

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

  const navigate = useNavigate();
const [serverMsg, setServerMsg] = useState("");
const [loading, setLoading] = useState(false);
//api calling 
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!isFormValid) return;

  setLoading(true);
  setServerMsg("");
  
  try {
    const res = await loginUser({  identifier, password });
    const data = res.data;
    console.log(" Login Response:", data);

    if (res.status === 200 && data.success) {
      setServerMsg(" Login successful!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } else {
      setServerMsg(` ${data.msg || "Login failed"}`);
    }
  } catch (err) {
    console.error(" Error during login:", err);
    setServerMsg(" Server or network error.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-poppins"
      style={{
        background: 'linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)',
      }}
    >
      {/*  hiding browser default toggle */}
      <style>
        {`
          input[type="password"]::-ms-reveal,
          input[type="password"]::-ms-clear {
            display: none;
          }
          input[type="password"]::-webkit-textfield-decoration-container,
          input[type="password"]::-webkit-inner-spin-button,
          input[type="password"]::-webkit-credentials-auto-fill-button {
            display: none !important;
            visibility: hidden;
          }
        `}
      </style>

      <div className="bg-white w-full max-w-[570px] sm:max-w-[480px] md:max-w-[500px] lg:max-w-[570px] rounded-2xl shadow-xl p-8 sm:p-10 md:p-14 lg:p-20 relative">
        {/* Close Button */}
        <button className="absolute top-4 right-6 text-gray-900 text-2xl">
          &times;
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <img src={logo} alt="Logo" className="h-6 sm:h-8" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-[24px] sm:text-[28px] md:text-[32px] font-medium text-gray-900 mb-1">
          Welcome back
        </h2>
        <p className="text-center text-[14px] sm:text-[16px] text-gray-600 mb-6 sm:mb-8">
          Do not have an account?{' '}
          <Link
            to="/signup"
            className="text-purple-700 font-small hover:underline"
          >
            Sign up
          </Link>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Identifier Field */}
          <div className="mb-4 sm:mb-5 relative">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Username or Email:
            </label>
            <input
              type="text"
              value={identifier}
              onChange={handleIdentifierChange}
              placeholder="Enter your username or email"
              className={`w-full border rounded-md px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 ${
                identifierError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#558CE6]'
              }`}
              required
            />
            {identifierError && (
              <img
                src={X}
                alt="Invalid identifier"
                className="absolute right-3 top-9 h-4 w-4 sm:h-5 sm:w-5"
              />
            )}
            {identifierError && (
              <p className="text-red-600 text-xs mt-1">
                Invalid email or username.
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4 sm:mb-5 relative">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Password:
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className={`w-full border rounded-md px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 ${
                passwordError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#558CE6]'
              }`}
              required
            />

            {/* Custom Eye Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9"
            >
              <img
                src={showPassword ? EyeOff : Eye}
                alt="Toggle visibility"
                className="h-4 w-4 sm:h-5 sm:w-5 opacity-80 hover:opacity-100 transition"
              />
            </button>

            {passwordError && (
              <p className="text-red-600 text-xs mt-1">
               Invalid password.
              </p>
            )}
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm mb-6 space-y-3 sm:space-y-0">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-4 w-4" />
              <span className="text-gray-900 text-sm sm:text-base">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[#707070] hover:underline text-[13px] sm:text-[14px]"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2.5 sm:py-3 rounded-md font-semibold transition text-sm sm:text-base ${
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





