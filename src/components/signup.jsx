import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import arrow from "../assets/arrow.svg"
export default function Signup() {
  const [username, setUsername] = useState("");
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // Validation
  const isUsernameValid = username.trim().length >= 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  const passwordRules = [
    {
      test: (pw) => pw.length >= 8,
      message: "Password must be at least 8 characters long",
    },
    {
      test: (pw) => /[A-Z]/.test(pw),
      message: "Password must contain at least 1 uppercase letter",
    },
    {
      test: (pw) => /[a-z]/.test(pw),
      message: "Password must contain at least 1 lowercase letter",
    },
    {
      test: (pw) => /\d/.test(pw),
      message: "Password must contain at least 1 digit",
    },
    {
      test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
      message: "Password must contain at least 1 special character",
    },
  ];
  const firstUnmetRule = passwordRules.find((rule) => !rule.test(password));
  const isPasswordValid =
    password && passwordRules.every((rule) => rule.test(password));
  const isFormValid =
    isUsernameValid && isEmailValid && isPasswordValid && termsAccepted;

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setServerMsg("");
    setUsernameExists(false);
    setEmailExists(false);

    const payload = { username, email, password };

    try {
      const res = await fetch("https://vow-org.me/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setServerMsg("✅ Registered successfully! Verification email sent.");
        navigate("/verify-otp", { state: { email } });
      } else {
        const msg = data.msg?.toLowerCase() || "";
        if (msg.includes("username")) {
          setUsernameExists(true);
        }
        if (msg.includes("user already exist")) {
          setEmailExists(true);
        }
        if (!msg.includes("username") && !msg.includes("user already exist")) {
          setServerMsg(`❌ ${data.msg || "Registration failed"}`);
        }
      }
    } catch (err) {
      setServerMsg("⚠️ Network or server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to render validation/check icon
  const renderIcon = (exists, valid) => {
    if (exists) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 absolute inset-y-0 right-2 m-auto text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    } else if (valid) {
      return (
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
      );
    } else {
      return null;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(55deg, #BFA2E1 26%,#EFE7F6 70%)" }}
    >
      <div className="bg-white shadow-xl rounded-2xl pb-10 w-full m-3 mt-1 mb-1 max-w-[570px] text-center box-border overflow-hidden">
        <div className="flex justify-start">
          <button
            className="text-gray-800 font-bold text-3xl mt-4 ml-3 "
            aria-label="Close"
          >
              <img src={arrow} alt="Back" className="h-6 sm:h-8" />
          </button>
        </div>

        <div className="px-6 sm:px-15">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="Logo" className="h-[35px] w-[51px]" />
          </div>

          <h2
            className="mb-2 text-gray-800 font-medium text-[32px]"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Create an account
          </h2>

          <p className="text-[#707070] text-[16px] mb-8 font-normal">
            Already have an account?{" "}
            <Link to="/login" className="text-[#5C0EA4] text-[16px] underline">
              log in
            </Link>
          </p>

          <form
            noValidate
            onSubmit={handleSubmit}
            className="space-y-4 text-left mt-8 m-3 mb-0"
          >
            {/* Username */}
            <div className="relative mb-0">
              <label className="block text-[#1F2937] mb-1 font-bold h-[19px]">
                Username:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameExists) setUsernameExists(false);
                  }}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                  className={`w-full px-2.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 box-border text-[16px] border ${
                    usernameExists
                      ? "border-red-500 focus:ring-red-500"
                      : username
                      ? isUsernameValid
                        ? "border-green-500 focus:ring-green-500"
                        : "border-[#558CE6] focus:ring-[#558CE6]"
                      : usernameFocused
                      ? "border-[#558CE6] focus:ring-[#558CE6]"
                      : "border-gray-600 focus:ring-[#558CE6]"
                  }`}
                />
                {renderIcon(usernameExists, isUsernameValid && !usernameExists)}
              </div>
              <p className="text-sm mt-1 min-h-[20px] text-red-500">
                {usernameExists
                  ? "Username already exist"
                  : username && !isUsernameValid
                  ? (<span className="text-[#558CE6]">Username must be at least 3 characters</span>)                  : ""}
              </p>
            </div>

            {/* Email */}
            <div className="relative mb-0">
              <label className="block text-gray-700 mb-1 h-[19px] font-bold">
                Email:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailExists) setEmailExists(false);
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className={`w-full px-2.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 box-border text-[16px] border ${
                    emailExists
                      ? "border-red-500 focus:ring-red-500"
                      : email
                      ? isEmailValid
                        ? "border-green-500 focus:ring-green-500"
                        : "border-[#558CE6] focus:ring-[#558CE6]"
                      : emailFocused
                      ? "border-[#558CE6] focus:ring-[#558CE6]"
                      : "border-gray-600 focus:ring-[#558CE6]"
                  }`}
                />
                {renderIcon(emailExists, isEmailValid && !emailExists)}
              </div>
              <p className="text-sm mt-1 min-h-[20px]">
  {emailExists ? (
    <span className="text-red-500">Account with this email already exists</span>
  ) : email && !isEmailValid ? (
    <span className="text-[#558CE6]">Enter a valid email (e.g., abc@domain.com)</span>
  ) : (
    ""
  )}
</p>

            </div>

            {/* Password */}
            <div className="relative mb-0">
              <label className="block text-gray-700 mb-1 h-[19px] font-bold">
                Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    showPassword ? "••••••••" : "Enter your password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className={`w-full px-2.5 py-2.5 pr-10 rounded-lg focus:outline-none focus:ring-2 box-border text-[16px] border ${
                    isPasswordValid
                      ? "border-green-500 focus:ring-green-500"
                      : inputFocused
                      ? "border-[#558CE6] focus:ring-[#558CE6]"
                      : "border-gray-600 focus:ring-[#558CE6]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-2 flex items-center z-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={
                      isPasswordValid
                        ? "green"
                        : inputFocused
                        ? "#558CE6"
                        : "gray"
                    }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        showPassword
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.021-3.429m4.112-2.668A9.966 9.966 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.957 9.957 0 01-4.173 5.093M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3m6 0a3 3 0 01-3 3m-3.707 3.707L20.293 3.707"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      }
                    />
                  </svg>
                </button>
              </div>
              <p className="text-[#558CE6] text-sm mt-1 min-h-[20px]">
                {password && firstUnmetRule ? firstUnmetRule.message : ""}
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 mb-8">
              <input
                type="checkbox"
                id="terms"
                className="mt-1.5 cursor-pointer size-4"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label
                htmlFor="terms"
                className="text-[16px] leading-relaxed text-[#000]"
              >
                I have read and agree with the{" "}
                <a href="#" className="text-[#213659] underline">
                  terms and conditions
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-2 rounded-lg font-normal h-[44px] text-[20px] transition ${
                !isFormValid || loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#450B7B] text-white hover:bg-[#5d11a3]"
              }`}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
            {serverMsg && (
              <p className="text-center mt-3 text-red-500">{serverMsg}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}


