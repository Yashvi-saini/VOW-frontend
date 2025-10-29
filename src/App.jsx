import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import ForgotPassword from './components/forgotpassword';
import VerifyOtp from './pages/verifyotp';
import ResetPassword from './pages/resetpassword';
import ResetSuccess from './pages/resetsuccess';
import Signup from "./components/signup";
import ApiTester from "./pages/apitester";
import Dashboard from "./components/dashboard/dashboard";
import TermsAndConditions from "./components/terms and conditions";
import ProfilePage from "./pages/profile/ProfilePage"; // adjust the path if needed
import Map from "./components/map/Map";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        <Route path="/apitester" element={<ApiTester />} />
        <Route path="/login" element={<Login />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/map" element={<Map />} />
      </Routes> 
    </Router>
  );
};  

export default App;
