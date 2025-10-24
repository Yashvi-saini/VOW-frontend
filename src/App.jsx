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
import TermsAndConditions from "./components/terms and conditions";
import ProfilePage from "./pages/profile/ProfilePage"; // adjust the path if needed
import Map from "./components/map/Map";

const App = () => {
  return (
    <Map/>
  );
};  

export default App;
