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
import Dashboard from "./pages/dashboard";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apitester" element={<ApiTester />} />
        <Route path="/login" element={<Login />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes> 
    </Router>
  );
};  

export default App;
