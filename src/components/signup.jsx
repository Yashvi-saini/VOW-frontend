import React, { useState } from "react";
import logo from "../assets/logo.svg";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-10 w-10" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Create an account
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Already have an account?{" "}
          <a href="#" className="text-[#450B7B] hover:underline">
            Log in
          </a>
        </p>

        {/* Form */}
        <form className="space-y-4 text-left">
          <div>
            <label className="block text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#450B7B]"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 mb-1">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#450B7B]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "" : ""}
            </button>
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 accent-[#450B7B] cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I have read and agree with the{" "}
              <a href="#" className="text-[#450B7B] hover:underline">
                terms and conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#450B7B] text-white font-semibold py-2 rounded-lg hover:bg-[#5d11a3] transition"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
