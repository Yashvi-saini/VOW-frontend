import React, { useState } from "react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  // Password validation rules
  const passwordRules = [
    { test: (pw) => pw.length >= 8, message: "Password must be at least 8 characters long" },
    { test: (pw) => /[A-Z]/.test(pw), message: "Password must contain at least 1 uppercase letter" },
    { test: (pw) => /[a-z]/.test(pw), message: "Password must contain at least 1 lowercase letter" },
    { test: (pw) => /\d/.test(pw), message: "Password must contain at least 1 digit" },
    { test: (pw) => /[!@#$%^&*(),.?\":{}|<>]/.test(pw), message: "Password must contain at least 1 special character" },
  ];
  const firstUnmetRule = passwordRules.find((rule) => !rule.test(password));

  // Email validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  // Derived validation state
  const isPasswordValid = password && passwordRules.every((rule) => rule.test(password));
  const isFormValid = isEmailValid && isPasswordValid;

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent browser alerts
    if (!isFormValid) {
      console.log("Form invalid");
      return;
    }
    console.log("✅ Form submitted:", { email, password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(55deg, #BFA2E1 26%,#EFE7F6 70%)" }}
    >
      <div className="bg-white shadow-xl rounded-2xl pb-10 w-full m-3 max-w-[570px] text-center box-border overflow-hidden">
        <div className="flex justify-end">
          <button className="text-gray-800 font-bold text-3xl mt-4 mr-4 pr-4" aria-label="Close">
            ×
          </button>
        </div>

        <div className="px-6 sm:px-15">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="Logo" className="h-[35px] w-[51px]" />
          </div>

          <h2 className="mb-2 text-gray-800 font-medium text-3xl" style={{ fontFamily: "Poppins, sans-serif" }}>
            Create an account
          </h2>

          <p className="text-gray-500 text-sm mb-6 font-normal">
            Already have an account?{" "}
            <a href="#" className="text-[#5C0EA4] underline">
              log in
            </a>
          </p>

          {/* ✅ Added noValidate + custom handler */}
          <form noValidate onSubmit={handleSubmit} className="space-y-4 text-left mt-8 m-3 mb-0">
            {/* Email */}
            <div className="relative mb-4">
              <label className="block text-gray-700 mb-1 font-bold">Email:</label>
              <div className="relative">
                <input
                  type="text" // 👈 changed from "email" to avoid browser validation
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className={`w-full px-2 py-2.5 rounded-lg focus:outline-none focus:ring-2 box-border text-[17px] border ${
                    email
                      ? isEmailValid
                        ? "border-green-500 focus:ring-green-500"
                        : "border-[#558CE6] focus:ring-[#558CE6]"
                      : emailFocused
                      ? "border-[#558CE6] focus:ring-[#558CE6]"
                      : "border-gray-600 focus:ring-[#558CE6]"
                  }`}
                />
                {/* ✅ Green tick for valid email */}
                {isEmailValid && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 absolute inset-y-0 right-2 m-auto text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className="text-[#558CE6] text-sm mt-1 min-h-[20px]">
                {email && !isEmailValid ? "Enter a valid email (e.g., abc@domain.com)" : ""}
              </p>
            </div>

            {/* Password */}
            <div className="relative mb-4">
              <label className="block text-gray-700 mb-1 font-bold">Password:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={showPassword ? "••••••••" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className={`w-full px-2 py-2.5 pr-10 rounded-lg focus:outline-none focus:ring-2 box-border text-[17px] border ${
                    isPasswordValid
                      ? "border-green-500 focus:ring-green-500"
                      : inputFocused
                      ? "border-[#558CE6] focus:ring-[#558CE6]"
                      : "border-gray-600 focus:ring-[#558CE6]"
                  }`}
                />
                {/* Eye toggle */}
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
              <input type="checkbox" id="terms" className="mt-1.5 cursor-pointer size-4" />
              <label htmlFor="terms" className="text-[17px] leading-relaxed text-gray-900">
                I have read and agree with the{" "}
                <a href="#" className="text-[#5C0EA4] underline">
                  terms and conditions
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-2 rounded-lg font-normal text-[20px] transition
                ${
                  !isFormValid
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#450B7B] text-white hover:bg-[#5d11a3]"
                }`}
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
