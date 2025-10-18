import React, { useState } from "react";
import logo from "../assets/logo.png";
import X from "../assets/X.png";
import Eye from "../assets/Eye.png";
import EyeOff from "../assets/Eyeoff.png";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import arrow from "../assets/arrow.svg"
const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverMsg, setServerMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIdentifierError("");
    setPasswordError("");
    setServerMsg("");

    if (!identifier || !password) {
      if (!identifier) setIdentifierError("Please enter your username or email.");
      if (!password) setPasswordError("Please enter your password.");
      return;
    }

    try {
      const res = await loginUser({ identifier, password });
      const data = res.data;

      if (res.status === 200 && data.success) {
        navigate("/dashboard"); // Direct navigation on success
      } else {
        setServerMsg(data.msg || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during login:", err);

      if (err.response?.status === 404) {
        setIdentifierError("");
        setPasswordError("");
        setServerMsg("");
      } else if (err.response?.status === 400) {
        setPasswordError("Invalid password");
        setIdentifierError("Please enter a valid email or username");
        setServerMsg("");
      } else {
        const msg = err.response?.data?.msg || "Server or network error.";
        setServerMsg(msg);
        setIdentifierError("");
        setPasswordError("");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-poppins"
      style={{ background: "linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)" }}
    >
      <div className="bg-white w-full max-w-[570px] rounded-2xl shadow-xl p-10 pr-9 pl-9 sm:px-20 relative">
        
        <button className="absolute top-3 left-6 text-gray-900 text-3xl" onClick={() => navigate(-1)}>
                  <img src={arrow} alt="Back" className="h-6 sm:h-8" />
                </button>
         
        <div className="flex justify-center ">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        

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

        {/* Heading */}
        <h2 className="text-center text-[28px] font-poppins font-medium text-gray-900 mb-1 ">
          Welcome back
        </h2>
        <p className="text-center text-[16px] font-poppins text-gray-600 mb-8">
          Do not have an account?{" "}
          <Link to="/signup" className="text-purple-700 hover:underline">
            Sign up
          </Link>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Identifier Field */}
          <div className="mb-4 relative">
            <label className="block text-sm font-poppins font-medium text-gray-900 mb-1">
              Username or Email:
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setIdentifierError("");
                setServerMsg("");
              }}
              placeholder="Enter your username or email"
              className={`w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 ${
                identifierError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#558CE6]"
              }`}
            />
            {identifierError && (
              <img src={X} alt="Invalid" className="absolute right-3 top-9 h-4 w-4" />
            )}
            <p className="text-red-600 mt-1 h-5 text-[14px] font-inter font-medium">
              {identifierError || " "}
            </p>
          </div>

          {/* Password Field */}
          <div className="mb-3 relative">
            <label className="block text-sm font-poppins font-medium text-gray-900 mb-1">
              Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
                setServerMsg("");
              }}
              placeholder="Enter your password"
              className={`w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 appearance-none ${
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#558CE6]"
              }`}
            />

            {/* Conditional Eye Toggle or Red X */}
            {passwordError ? (
              <img src={X} alt="Invalid" className="absolute right-3 top-9 h-4 w-4" />
            ) : (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9"
              >
                <img
                  src={showPassword ? EyeOff : Eye}
                  alt="Toggle visibility"
                  className="h-4 w-4 opacity-80 hover:opacity-100 transition"
                />
              </button>
            )}

            <p className="text-red-600 mt-1 h-5 text-[14px] font-inter font-medium">
              {passwordError || " "}
            </p>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex justify-between items-center text-sm mb-8">
            <label className="flex items-center space-x-2 font-poppins text-gray-900">
              <input type="checkbox" className="h-4 w-4" />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[#707070] hover:underline text-[14px] font-inter font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-md font-semibold text-sm bg-[#450B7B] text-white hover:bg-[#3a0863] transition"
          >
            Login
          </button>

          {/* Generic Server Messages */}
          {serverMsg && (
            <p
              className={`text-center mt-4 text-sm ${
                serverMsg.includes("successful")
                  ? "text-green-600"
                  : "text-red-600"
              } font-inter font-medium`}
            >
              {serverMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
