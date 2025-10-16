import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Eye from "../assets/Eye.png";
import EyeOff from "../assets/Eyeoff.png";
import logo from "../assets/logo.png";
import { useEffect } from "react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const navigate = useNavigate();

  // Password rules
  const passwordRules = [
    { test: (pw) => pw.length >= 8, message: "Password must be at least 8 characters long" },
    { test: (pw) => /[A-Z]/.test(pw), message: "Password must contain at least 1 uppercase letter" },
    { test: (pw) => /[a-z]/.test(pw), message: "Password must contain at least 1 lowercase letter" },
    { test: (pw) => /\d/.test(pw), message: "Password must contain at least 1 digit" },
    { test: (pw) => /[!@#$%^&*(),.?\":{}|<>]/.test(pw), message: "Password must contain at least 1 special character" },
  ];

  const firstUnmetRule = passwordRules.find(rule => !rule.test(password));
  const isPasswordValid = passwordRules.every(rule => rule.test(password));
useEffect(() => {
  if (isPasswordValid && error === "Please meet all password requirements before continuing.") {
    setError("");
  }
}, [isPasswordValid, error]);

useEffect(() => {
  if (
    password === confirm &&
    error === "Passwords do not match"
  ) {
    setError("");
  }
}, [password, confirm, error]);


  const handleReset = (e) => {
    e.preventDefault();
    setError("");
   
    
    if (!isPasswordValid) {
      setError("Please meet all password requirements before continuing.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    navigate("/reset-success");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EADCFB] to-[#D3C3F7]">
      <div
        className="bg-[#FAFAFA] rounded-xl w-full max-w-[570px] relative flex flex-col px-20 py-10 sm:px-20 sm:py-10 md:mx-10 lg:px-20 transition-all"
        style={{ boxShadow: "0px 4px 20px rgba(0,0,0,0.08)" }}
      >
        {/* Close Icon */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-10 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        {/* Title */}
        <h2
          style={{
            color: "#1F2937",
            textAlign: "center",
            fontFamily: "Poppins",
            fontSize: "32px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          Reset Password
        </h2>
        <p className="flex justify-center text-[#707070] text-[16px] mb-8 font-normal">
          Enter your new password below
        </p>

        <form onSubmit={handleReset} className="flex flex-col space-y-5">
          {/* New Password */}
          <div className="flex flex-col mb-0">
            <label className="text-[14px] font-medium text-gray-700 mb-1 mt-0">
              New Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className={`w-full rounded-md px-3 py-2 text-sm transition-all focus:outline-none border ${
                  isPasswordValid
                    ? "border-green-500 focus:ring-green-500" 
                    : inputFocused
                    ? "border-[#558CE6] focus:ring-[#558CE6]"
                    : "border-gray-300 focus:ring-[#558CE6]"
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

            {/* Warning / requirement space */}
            <p
  className={`text-sm mt-1 mb-3 min-h-[20px] ${
    password.length > 0 && firstUnmetRule ? "text-[#558CE6]" : "text-transparent"
  }`}
>
  {password&&firstUnmetRule?.message || " "} {/* put a space to preserve line height */}
</p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col mb-0">
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
                    ? password === confirm && isPasswordValid
                      ? "border-2 border-green-500 ring-1 ring-green-300"
                      : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
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

            {/* Fixed space for confirm password errors */}
            <p className="text-sm min-h-[20px] text-transparent"></p>
          </div>

          {/* Error Message */}
          { (
            <p
  className={`text-sm text-center -mt-1 mb-1 min-h-[20px] transition-all ${
    error ? "text-[#558CE6]" : "text-transparent"
  }`}
>
  {error || " "} {/* keeps the height stable */}
</p>
          )}

          

          <button
            type="submit"
            className="w-full bg-[#4B0076] text-white py-2 rounded-md font-medium hover:bg-[#3a0060] transition-colors "
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
