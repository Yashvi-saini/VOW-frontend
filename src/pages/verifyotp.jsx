import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import arrow from "../assets/arrow.svg";
import { verifyEmail, resendOtp, forgotPassword, verifyResetOtp } from '../api/authApi';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const mode = location.state?.mode || "signup"; // 'signup' or 'forgot'

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) inputRefs.current[index + 1]?.focus();

    if (newOtp.every(d => d === "")) {
      setOtpError(false);
      setMessage("");
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError(true);
      setMessage("Please enter the 6-digit OTP.");
      return;
    }
    if (!email) {
      alert("No email found. Please try again.");
      navigate(mode === "signup" ? "/signup" : "/forgot-password");
      return;
    }

  setLoading(true);
  setMessage("");
  setOtpError(false);

    try {
      let res, data;

      if (mode === "signup") {
        console.log("Sending signup verifyEmail payload:", { email, code });
        res = await verifyEmail({ email, code });
      } else if (mode === "forgot") {
        console.log("Sending forgot verifyResetOtp payload:", { email, otp: code });
        res = await verifyResetOtp({ email, otp: code });
      }
      data = res.data;

      if (res.status === 200 && data.success) {
        setOtpError(false);
        setMessage(" OTP verified successfully!");
        setTimeout(() => {
          if (mode === "signup") {
            navigate("/login");
          } else {
            navigate("/reset-password", { state: { email, resetToken: data.resetToken } });
          }
        }, 1500);
      } else {
        setOtpError(true);
        setMessage(data.msg || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setOtpError(true);
      setMessage(err.response?.data?.msg || "Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!email || timer > 0) return;
    setTimer(30);
    setResendLoading(true);
    setMessage("");

    try {
      let res, data;
      if (mode === "signup") {
        res = await resendOtp({ email });
        
      } else if (mode === "forgot") {
        res = await forgotPassword({ email });
      }
      data = res.data;
      setMessage(data.msg || "OTP sent successfully!");
    } catch (err) {
      console.error("Error resending OTP:", err);
      setMessage(err.response?.data?.msg || "Could not resend OTP.");
    } finally {
      setResendLoading(false);
    }
  }
   
};

const handleResend = async () => {
  if (!email || timer > 0) return;
  setTimer(30);
  setResendLoading(true);
  setMessage("");

  try {
    let res, data;

    if (mode === "signup") {
      const payload = { email };
      console.log("📤 Signup resendOtp payload:", payload); // Log payload
      res = await resendOtp(payload);
      data = res.data;
      console.log("📥 Signup resendOtp response:", data); // Log response
    } else {
      const payload = { email };
      console.log("📤 Forgot forgotPassword payload:", payload); // Log payload
      res = await forgotPassword(payload);
      data = res.data;
      console.log("📥 Forgot forgotPassword response:", data); // Log response
    }

    setMessage(data.msg || "OTP resent!");
  } catch (err) {
    console.error("Error resending OTP:", err);
    setMessage("Could not resend OTP.");
  } finally {
    setResendLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-poppins"
      style={{ background: "linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)" }}
    >
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl w-full max-w-[570px] mx-4 sm:mx-20">

        <button className="absolute top-6 left-5" onClick={() => navigate(-1)}>
          <img src={arrow} alt="Back" className="h-6 sm:h-8" />
        </button>

        <div className="flex justify-center pt-4">
          <img src={logo} alt="Logo" className="h-8 sm:h-10" />
        </div>

        <h2 className="text-center text-[24px] sm:text-[32px] font-semibold text-gray-900 mt-4">
          {mode === "signup" ? "Verify Your Email" : "Reset Password OTP"}
        </h2>
        <p className="text-center text-[14px] sm:text-[16px] text-[#707070] mb-8 sm:mb-10">
          {mode === "signup"
            ? "Please enter the code sent to your email to verify your account."
            : "Enter the OTP sent to your email to reset your password."}
        </p>

        <form onSubmit={handleVerify} className="w-full">
          <div className="flex justify-between mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={el => inputRefs.current[index] = el}
                className={`text-center border rounded-sm focus:outline-none transition-all duration-200 ${
                  otpError
                    ? "border-[#E63946] bg-[#FDEDEC]"
                    : "border-[#D9D9D9] bg-[#F9F6FC]"
                }`}
                style={{ width: "clamp(35px, 9vw, 56px)", height: "clamp(35px, 9vw, 56px)", fontSize: "clamp(14px, 4vw, 20px)" }}
              />
            ))}
          </div>

          <p className={`text-center mb-4 ${otpError ? "text-[#E63946]" : "text-green-600"}`} style={{ minHeight: "1em" }}>
            {message || " "}
          </p>

          <button type="submit" disabled={loading} className="w-full text-[18px] sm:text-[20px] bg-[#450B7B] text-white py-2.5 rounded-md font-normal hover:bg-[#3a0863] transition">
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="flex justify-center mt-4 text-[#450B7B]">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || timer > 0}
              className={`px-5 py-2 w-full sm:text-lg rounded-md font-medium border border-purple-700 text-[#450B7B] transition-all duration-200 ${timer > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );


export default VerifyOtp;
