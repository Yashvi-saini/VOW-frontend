import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import FlowProtectedRoute from "./FlowProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./components/signup";
import ForgotPassword from "./components/forgotpassword";
import VerifyOtp from "./pages/verifyotp";
import ResetPassword from "./pages/resetpassword";
import ResetSuccess from "./pages/ResetSuccess";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/profile/ProfilePage";
import Map from "./components/map/Map";
import ChatApp from "./components/chat/chat";
import TermsAndConditions from "./components/terms and conditions";
import ApiTester from "./pages/ApiTester";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        <Route path="/apitester" element={<ApiTester />} />
        <Route
          path="/verify-otp"
          element={
            <FlowProtectedRoute
              condition={!!localStorage.getItem("signupDone") || !!localStorage.getItem("forgotRequested")}
              redirectTo={
                !!localStorage.getItem("signupDone") ? "/signup" : "/forgot-password"
              }
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
              <Map />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatApp username="UserB" roomId="room1" />
            </ProtectedRoute>
          }
        />
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
