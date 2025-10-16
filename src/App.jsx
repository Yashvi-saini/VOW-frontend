import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import ForgotPassword from './components/forgotpassword';
import VerifyOtp from './pages/verifyotp';
import ResetPassword from './pages/resetpassword';
import ResetSuccess from './pages/resetsuccess';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
      </Routes>
    </Router>
  );
};

export default App;
