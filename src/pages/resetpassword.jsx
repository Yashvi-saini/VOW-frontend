import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Eye from "../assets/Eye.svg";
import blueeye from "../assets/blue eye.svg"
import eyeoff from "../assets/Eye off.svg"
import blueEyeOff from "../assets/blue eye off.png";
import logo from "../assets/logo.png";
import { resetPassword } from "../api/authApi";
import arrow from "../assets/arrow.svg";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [passwordFocused, setPasswordFocused] = useState(false);
const [confirmFocused, setConfirmFocused] = useState(false);

  if (!email) {
    navigate("/forgot-password"); // redirect if email not found
  }  

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
    if (password === confirm && error === "Passwords do not match") {
      setError("");
    }
  }, [password, confirm, error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      alert("Your session has expired");
      navigate("/forgot-password");
    }, 5 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleReset = async (e) => {
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

    setLoading(true);

    try {
      const res = await resetPassword(password);
      if (res.status === 200 && res.data.success) {
        navigate("/reset-success"); // go to success page
      } else {
        setError(res.data.msg || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Network or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EADCFB] to-[#D3C3F7]">
      <div className="bg-[#FAFAFA] rounded-xl w-full max-w-[570px] relative  mx-2 flex-col px-10 py-10 sm:px-20 sm:py-10 md:mx-10 lg:px-20 transition-all"
        style={{ boxShadow: "0px 4px 20px rgba(0,0,0,0.08)" }}
      >
        {/* Close Icon */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-10 text-gray-400 hover:text-gray-600 text-xl"
        >
          <img src={arrow} alt="Back" className="h-6 sm:h-8" />
        </button>

        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        <h2 className="text-center text-[32px] font-medium text-[#1F2937] mt-4">
          Reset Password
        </h2>
        <p className="text-center text-[#707070] text-[16px] mb-8 font-normal">
          Enter your new password below
        </p>

        <form onSubmit={handleReset} className="flex flex-col space-y-5">
          {/* New Password */}
        {/* New Password */}
<div className="flex flex-col mb-0">
  <label className="text-[14px] font-medium text-gray-700 mb-1 mt-0">New Password:</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter new password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onFocus={() => setPasswordFocused(true)}
      onBlur={() => setPasswordFocused(false)}
      className={`w-full rounded-md px-3 py-2 text-sm transition-all focus:outline-none border
        ${
          password.length === 0 && !passwordFocused
            ? "border-gray-300 bg-white"
            : passwordFocused
            ? "border-[#558CE6] bg-white focus:ring-[#558CE6]"
            : "border-purple-700 bg-[#F5F1FB]"
        }
      `}
      required
    />
    <img
      src={
        password.length === 0
          ? showPassword
            ? eyeoff
            : Eye
          : showPassword
          ? blueEyeOff
          : blueeye
      }
      alt="Toggle visibility"
      className="absolute right-3 top-2.5 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => setShowPassword(!showPassword)}
    />
  </div>
  <p className={`text-sm mt-1 mb-3 min-h-[20px] ${password.length > 0 && firstUnmetRule ? "text-[#558CE6]" : "text-transparent"}`}>
    {password && firstUnmetRule?.message || " "}
  </p>
</div>

{/* Confirm Password */}
<div className="flex flex-col mb-0">
  <label className="text-[14px] font-medium text-gray-700 mb-1">Confirm Password:</label>
  <div className="relative">
    <input
      type={showConfirm ? "text" : "password"}
      placeholder="Enter password again"
      value={confirm}
      onChange={(e) => setConfirm(e.target.value)}
      onFocus={() => setConfirmFocused(true)}
      onBlur={() => setConfirmFocused(false)}
      className={`w-full border rounded-md px-3 py-2 text-sm transition-all focus:outline-none
        ${
          confirm.length === 0 && !confirmFocused
            ? "border-gray-300 bg-white"
            : confirmFocused
            ? "border-[#558CE6] bg-white focus:ring-[#558CE6]"
            : confirm === password && password.length > 0
            ? "border-purple-700 bg-[#F5F1FB]"
            : "border-red-500 bg-[#FDEDEC]"
        }
      `}
      required
    />
    <img
      src={
        confirm.length === 0
          ? showConfirm
            ? eyeoff
            : Eye
          : showConfirm
          ? blueEyeOff
          : blueeye
      }
      alt="Toggle visibility"
      className="absolute right-3 top-2.5 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100"
      onClick={() => setShowConfirm(!showConfirm)}
    />
  </div>
  <p className={`text-sm mt-1 mb-3 min-h-[20px] ${confirm && confirm !== password ? "text-red-500" : "text-transparent"}`}>
    {confirm && confirm !== password ? "Passwords do not match" : " "}
  </p>
</div>


          {/* Error Message */}
          <p className={`text-sm text-center -mt-1 mb-1 min-h-[20px] transition-all ${error ? "text-[#558CE6]" : "text-transparent"}`}>
            {error || " "}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4B0076] text-white py-2 rounded-md font-medium hover:bg-[#3a0060] transition-colors"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
