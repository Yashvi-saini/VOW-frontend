import React, { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import X from "@/assets/X.png";
import Eye from "@/assets/Eye.svg";
import EyeOff from "@/assets/Eye off.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserProfile,
  clearWorkspaceContext,
  setUserId,
} from "./userSlice";
import { loginUser } from "@/api/authApi";
import { getProfileInfo } from "@/api/profileapi";
import arrow from "@/assets/arrow.svg";
import Background from "@/features/landing/Background";
import socket, { connectSocket } from "@/features/chat/socket";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isProfileNeeded } = useSelector((state) => state.user);
  const profile = useSelector((state) => state.user.profile);

  const isLoggedI = localStorage.getItem("isLogged") === "true";
  const valid = localStorage.getItem("valid") !== "true";

  useEffect(() => {
    if (isLoggedI && profile && valid) {
      navigate("/dashboard");
      localStorage.setItem("valid", "false");
    }
  }, [isLoggedI, profile, navigate, valid]);

  useEffect(() => {
    const savedIdentifier = localStorage.getItem("rememberedIdentifier");
    if (savedIdentifier) {
      setIdentifier(savedIdentifier);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIdentifierError("");
    setPasswordError("");

    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier || !password) {
      if (!trimmedIdentifier)
        setIdentifierError("Please enter your username or email.");
      if (!password) setPasswordError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser({
        identifier: trimmedIdentifier,
        password,
      });

      if (res.success) {
        const { user, accessToken, refreshToken } = res;
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        dispatch(setUserId(user._id));
        try {
          const profileRes = await getProfileInfo();
          if (profileRes.status === 200 && profileRes.data.success) {
            dispatch(setUserProfile(profileRes.data.data));
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }

        dispatch(clearWorkspaceContext());

        if (rememberMe) {
          localStorage.setItem("rememberedIdentifier", trimmedIdentifier);
        } else {
          localStorage.removeItem("rememberedIdentifier");
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isLogged", "true");
        connectSocket();

        if (isProfileNeeded) {
          navigate("/profile");
        } else {
          navigate("/dashboard");
        }

      } else {
        setPasswordError("Invalid password");
      }

    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.msg || "Server error";

      if (status === 404) {
        setIdentifierError("Email or username not found");
      } else if (status === 400) {
        setPasswordError("Invalid password");
      } else {
        setPasswordError(msg);
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      <Background />
      <div className="min-h-screen flex items-center justify-center px-4 font-poppins">
        <div className="bg-white w-full max-w-[35.625rem] rounded-2xl shadow-xl p-10 sm:px-20 relative">

          <button
            className="absolute top-3 left-6 text-gray-900 text-3xl cursor-pointer"
            onClick={() => navigate("/")}
            aria-label="Back to home"
          >
            <img src={arrow} alt="Back" className="h-6 sm:h-8" />
          </button>

          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-8" />
          </div>

          <h2 className="text-center text-[1.75rem] font-medium text-gray-900 mb-1">
            Welcome back
          </h2>

          <p className="text-center text-[1rem] text-gray-600 mb-8">
            Do not have an account?{" "}
            <Link to="/signup" className="text-purple-700 hover:underline">
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit}>

            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Username or Email:
              </label>
              <input
                type="text"
                value={identifier}
                maxLength={50}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setIdentifierError("");
                }}
                className={`w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                  identifierError
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <p className="text-red-600 mt-1 text-sm">
                {identifierError || " "}
              </p>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Password:
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className={`w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    passwordError
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 flex items-center justify-center cursor-pointer text-gray-500 hover:text-gray-700 z-10 focus:outline-none"
                >
                  <img
                    src={showPassword ? EyeOff : Eye}
                    alt={showPassword ? "Hide password" : "Show password"}
                    className="h-5 w-5 object-contain"
                  />
                </button>
              </div>
              <p className="text-red-600 mt-1 text-sm">
                {passwordError || " "}
              </p>
            </div>

            <div className="flex justify-between mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-md transition cursor-pointer font-medium"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default Login;