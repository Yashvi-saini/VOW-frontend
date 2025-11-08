import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import FlowProtectedRoute from "./FlowProtectedRoute";
import RouteWatcher from "./RouteWatcher";

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./components/signup";
import ForgotPassword from "./components/forgotpassword";
import VerifyOtp from "./pages/verifyotp";
import ResetPassword from "./pages/resetpassword";
import ResetSuccess from "./pages/resetsuccess";
import Dashboard from "./components/dashboard/dashboard.jsx";
import ProfilePage from "./pages/profile/ProfilePage";
import Map from "./components/map/Map";
import ChatApp from "./components/chat/chat";
import { useSelector } from "react-redux";

import TermsAndConditions from "./components/terms and conditions";


const App = () => {

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const { signupPending, forgotRequested: rdxForgot } = useSelector((state) => state.user || {});
  const forgotRequested = rdxForgot || !!localStorage.getItem("forgotRequested");

  // Allow verify-otp whenever a flow is active (signup or forgot), regardless of login
  const verifyCondition = !!signupPending || !!forgotRequested;
  const verifyRedirectTo = forgotRequested ? "/forgot-password" : "/signup";

  return (
    <Router>
      <RouteWatcher />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
       
        
        <Route
          path="/verify-otp"
          element={
            <FlowProtectedRoute
              condition={verifyCondition}
              redirectTo={verifyRedirectTo}
            >
              <VerifyOtp />
            </FlowProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <FlowProtectedRoute
              condition={!!localStorage.getItem("forgotOtpVerified")}
              redirectTo="/forgot-password"
            >
              <ResetPassword />
            </FlowProtectedRoute>
          }
        />
        <Route
          path="/reset-success"
          element={
            <FlowProtectedRoute
              condition={!!localStorage.getItem("resetDone")}
              redirectTo="/login"
            >
              <ResetSuccess />
            </FlowProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
                <FlowProtectedRoute
                  // allow when session flag set by dashboard button
                  condition={sessionStorage.getItem("allowMap") === "true"}
                  redirectTo="/login"
                >
                  <Map />
                </FlowProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route path="/workspace/:workspaceId/chat" element={<ChatApp/>} />
        <Route
          path="/"
          element={
            
              <Home />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
