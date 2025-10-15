import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Eye from "../assets/Eye.png";
import EyeOff from "../assets/Eyeoff.png";
import logo from "../assets/logo.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

   const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
if (!isValid) {
  setError("Password must contain 8 characters, including uppercase, lowercase & number");
  return;
}


    navigate("/reset-success");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EADCFB] to-[#D3C3F7]">
      <div
        className="bg-[#FAFAFA] rounded-xl shadow-md w-[448px] h-[513px] relative flex flex-col px-5 py-10"
        style={{ boxShadow: "0px 4px 20px rgba(0,0,0,0.08)" }}
      >
        {/* Close Icon */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        {/* Title */}
        <h2 
        style={{color:' #1F2937',

        textAlign: 'center',
        fontFamily: 'Poppins',
        fontSize: '32px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: 'normal'}}>
          Reset Password
        </h2>

        {/* Form */}
        <form onSubmit={handleReset} className="flex flex-col space-y-5">
          {/* New Password */}
          <div className="flex flex-col">
            <label className="text-[14px] font-medium text-gray-700 mb-1 mt-8">
              New Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm transition-all focus:outline-none ${
                  password.length > 0
                    ? "border-blue-500 ring-1 ring-blue-400"
                    : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                }`}
                required
              />
              <img
                src={password.length > 0 ? (showPassword ? EyeOff : Eye) : Eye}
                alt="Toggle visibility"
                className="absolute right-3 top-2.5 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            {/* Password hint */}
            <p className="text-xs text-[#558CE6] mt-1">
              Password must contain 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="text-[14px] font-medium text-gray-700 mb-1">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Enter password again"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm transition-all focus:outline-none ${
                  confirm.length > 0
                    ? "border-blue-500 ring-1 ring-blue-400"
                    : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                }`}
                required
              />
              <img
                src={confirm.length > 0 ? (showConfirm ? EyeOff : Eye) : Eye}
                alt="Toggle visibility"
                className="absolute right-3 top-2.5 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100"
                onClick={() => setShowConfirm(!showConfirm)}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-xs text-center -mt-1">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#4B0076] text-white py-2 rounded-md font-medium hover:bg-[#3a0060] transition-colors mt-2"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

