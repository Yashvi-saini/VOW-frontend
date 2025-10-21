import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import arrow from "../assets/arrow.svg";
import Eye from "../assets/Eye.svg";
import EyeOff from "../assets/Eye off.svg";
import BlueEye from "../assets/blue eye.svg";
import BlueEyeOff from "../assets/blue eye off.png";

import { registerUser } from "../api/authApi";

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
  const [userexists, setuserexists] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);

  // Trimmed username
const trimmedUsername = username.trim();

// Username validations
const isUsernameNotEmpty = trimmedUsername.length > 0;
const isUsernameMinLength = trimmedUsername.length >= 3;
const isUsernameMaxLength = trimmedUsername.length <= 20;
const isUsernameValidChars = /^[a-zA-Z0-9._]+$/.test(trimmedUsername);
const noConsecutiveSpecials = !/[\._]{2,}/.test(trimmedUsername);
const validStartEnd = /^[a-zA-Z0-9].*[a-zA-Z0-9]$/.test(trimmedUsername);

// Final combined username validity
const isUsernameValid =
  isUsernameNotEmpty &&
  isUsernameMinLength &&
  isUsernameMaxLength &&
  isUsernameValidChars &&
  noConsecutiveSpecials &&
  validStartEnd;


  // Validation
  
 const trimmedEmail = email.trim(); // removes leading & trailing spaces
const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail);


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
  /******** */
  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setServerMsg("");
    setUsernameExists(false);
    setEmailExists(false);

    const payload = { 
  username: trimmedUsername, // use trimmed version
  email: email.trim(), 
  password 
};


    try {
      const res = await registerUser(payload);
      const data = res.data;

      if (data.success) {
        setServerMsg("");
        navigate("/verify-otp", { state: { email } });
      }
    } catch (err) {
      // ✅ If server responded (e.g., 400, 409, etc.)
      if (err.response) {
        const msg = err.response.data?.msg?.toLowerCase() || "";

        if (msg.includes("username already taken")) {
          setUsernameExists(true);
        }
        if (msg.includes("user already exists")) {
          setuserexists(true);
        }

        // ✅ Show backend message instead of generic server error
        setServerMsg(err.response.data.msg || "Registration failed");
      } else {
        // ✅ Real network error (no response from server)
        setServerMsg("Network or server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to render validation/check icon

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(55deg, #BFA2E1 26%,#EFE7F6 70%)" }}

    >

      
      <div className="bg-white shadow-xl rounded-2xl pb-10 w-full m-3 max-w-[570px] text-center box-border overflow-hidden z-10">
        <div className="flex justify-start">
          <button
            className="text-gray-800 font-bold text-3xl mt-2 ml-4 "
            aria-label="Close"
            onClick={() => navigate("/")}
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
                    if (!usernameTouched) setUsernameTouched(true);
                    if (usernameExists) setUsernameExists(false);
                  }}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                  className={`w-full px-2.5 py-2.5 rounded-lg focus:outline-none focus:ring-2 box-border text-[16px] border ${
                    usernameExists
                      ? "border-red-500 focus:ring-red-500"
                      : username && !usernameFocused // ✅ not empty AND not touched
                      ? "bg-[#F5F1FB] border-[#8F7AA9] focus:ring-[#558CE6]"
                      : usernameFocused || username // when focused or typing
                      ? "border-[#558CE6] focus:ring-[#558CE6]"
                      : "border-gray-600 focus:ring-[#558CE6]"
                  }`}
                />
              </div>
              <p className="text-sm mt-1 min-h-[20px] text-red-500">
  {usernameExists
    ? "Username already taken"
    : usernameTouched && !isUsernameMinLength
    ? "Username must be at least 3 characters"
    : usernameTouched && !isUsernameMaxLength
    ? "Username cannot exceed 20 characters"
    : usernameTouched && !isUsernameValidChars
    ? "Username can only contain letters, numbers, _ or ."
    : usernameTouched && !noConsecutiveSpecials
    ? "Username cannot have consecutive _ or ."
    : usernameTouched && !validStartEnd
    ? "Username cannot start or end with _ or ."
    : ""}
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
                      : email && !emailFocused // ✅ not empty AND not touched
                      ? "bg-[#F5F1FB] border-[#8F7AA9] focus:ring-[#558CE6]"
                      : emailFocused || email // when focused or typing
                      ? "border-[#558CE6] focus:ring-[#558CE6]"
                      : "border-gray-600 focus:ring-[#558CE6]"
                  }`}
                />
              </div>
              <p className="text-sm mt-1 min-h-[20px] text-red-500">
                {emailExists
                  ? "Email already exists"
                  : email && !isEmailValid
                  ? "Enter a valid email"
                  : ""}
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
                    password && !inputFocused // ✅ not empty AND not touched
                      ? "bg-[#F5F1FB] border-[#8F7AA9] focus:ring-[#558CE6]"
                      : inputFocused || password // when focused or typing
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
                  <img
                    src={
                      !password && !inputFocused
                        ? showPassword
                          ? EyeOff 
                          : Eye 
                        : showPassword 
                        ? BlueEyeOff
                        : BlueEye
                    }
                    alt="toggle password"
                    className="h-5 w-5"
                  />
                </button>
              </div>
              <p className="text-[#558CE6] text-sm mt-1 min-h-[20px]">
                {password && firstUnmetRule
                  ? firstUnmetRule.message
                  : userexists
                  ? "User already exists"
                  : ""}
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
                <a href="/TermsAndConditions" className="text-[#213659] underline">
                  terms and conditions
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              
             className="w-full py-2 rounded-lg font-normal h-[44px] text-[20px] transition bg-[#450B7B] text-white hover:bg-[#5d11a3]"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
