import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import X from "../assets/X.png";
import Eye from "../assets/Eye.png";
import EyeOff from "../assets/blue eye off.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile, clearWorkspaceContext } from "../components/userslice";
import { loginUser } from "../api/authApi";
import { getProfileInfo } from "../api/profileapi";
import arrow from "../assets/arrow.svg";
import Background from "../components/background";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // NEW
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isProfileNeeded } = useSelector((state) => state.user);
const profile = useSelector((state) => state.user.profile);

const isLoggedI = localStorage.getItem("isLogged") === "true";
const valid=localStorage.getItem("valid")!=="true";
useEffect(() => {
  if (isLoggedI && profile && valid) {
    navigate("/dashboard");
    localStorage.setItem("valid", "false");
  }
}, [isLoggedI, profile, navigate, valid]);
  // Prefill saved identifier
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
    setLoading(true); // START loading

    try {
      const res = await loginUser({ identifier: trimmedIdentifier, password });
      console.log("Login response:", res);
      if (res.status === 200 && res.data.success) {
        // Handle "Remember Me"
        const { accessToken, refreshToken, user } = res.data;
       try {
            const profileRes = await getProfileInfo();
            if (profileRes.status === 200 && profileRes.data.success) {
             dispatch(setUserProfile(profileRes.data.data));
            }
          } catch (err) {
            console.error("Error fetching profile:", err);
          }
        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        console.log("Access Token:", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        dispatch(clearWorkspaceContext()); // ✅ reset workspaceId and token

        if (rememberMe) {
          localStorage.setItem("rememberedIdentifier", trimmedIdentifier);
        } else {
          localStorage.removeItem("rememberedIdentifier");
        }
        localStorage.setItem("isLoggedIn", "true");
         localStorage.setItem("isLogged", "true");
        // Update Redux user profile for UI components (Topbar/Sidebar)
        console.log("Dispatching profile:", {
          username: user?.username,
          fullName: user?.fullName,
          email: user?.email,
          avatar: user?.avatar,
        });
          
          // If login response doesn’t include profile, fetch it
          
        



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
        <div className="bg-white w-full max-w-[570px] rounded-2xl shadow-xl p-10 pr-10 pl-10 sm:px-20 relative">
          {/* Back Button */}
          <button
            className="absolute top-3 left-6 text-gray-900 text-3xl "
            onClick={() => navigate("/")}
          >
            <img src={arrow} alt="Back" className="h-6 sm:h-8" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-6 ">
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
          <h2 className="text-center text-[28px] font-medium text-gray-900 mb-1">
            Welcome back
          </h2>
          <p className="text-center text-[16px] text-gray-600 mb-8">
            Do not have an account?{" "}
            <Link to="/signup" className="text-purple-700 hover:underline">
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit}>
            {/* Identifier Field */}
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
                placeholder="Enter your username or email"
                className={`w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 ${
                  identifierError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#558CE6]"
                }`}
              />
              {identifierError && (
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier("");
                    setIdentifierError("");
                  }}
                  className="absolute right-3 top-9"
                >
                  <img
                    src={X}
                    alt="Clear"
                    className="h-4 w-4 cursor-pointer hover:opacity-70 transition"
                  />
                </button>
              )}
              <p className="text-red-600 mt-1 h-5 text-[14px] font-inter font-medium">
                {identifierError || " "}
              </p>
            </div>

            {/* Password Field */}
            <div className="mb-3 relative">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                maxLength={20}
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Enter your password"
                className={`w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 appearance-none ${
                  passwordError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#558CE6]"
                }`}
              />
              {/* Show eye icon only when: no error OR (error exists but password has text) */}
              {(!passwordError || password) && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-9 ${
                    passwordError && password ? "right-9" : "right-3"
                  }`}
                >
                  <img
                    src={showPassword ? EyeOff : Eye}
                    alt="Toggle visibility"
                    className="h-4 w-4 opacity-80 hover:opacity-100 transition"
                    style={
                      passwordError && password
                        ? {
                            filter:
                              "brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)",
                          }
                        : {}
                    }
                  />
                </button>
              )}
              {passwordError && (
                <button
                  type="button"
                  onClick={() => {
                    setPassword("");
                    setPasswordError("");
                    setShowPassword(false);
                  }}
                  className="absolute right-3 top-9"
                >
                  <img
                    src={X}
                    alt="Clear"
                    className="h-4 w-4 cursor-pointer hover:opacity-70 transition"
                  />
                </button>
              )}
              <p className="text-red-600 mt-1 h-5 text-[14px] font-inter font-medium">
                {passwordError || " "}
              </p>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex justify-between items-center text-sm mb-8">
              <label className="flex items-center space-x-2 text-gray-900">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-[#707070] hover:underline text-[14px] font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md font-semibold text-sm bg-[#450B7B] text-white hover:bg-[#3a0863] transition"
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
