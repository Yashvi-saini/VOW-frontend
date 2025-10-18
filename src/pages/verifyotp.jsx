import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import arrow from "../assets/arrow.svg";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(30); // ⏱️ countdown in seconds
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isFocused, setIsFocused] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const email = location.state?.email;

  // ⏳ Timer effect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (index, value) => {
  // Allow only digits or empty
  if (!/^\d?$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  // Focus next input if a digit is entered
  if (value && index < otp.length - 1) {
    inputRefs.current[index + 1]?.focus();
  }

  // ✅ Check if all input boxes are now empty
  const allEmpty = newOtp.every((digit) => digit === "");
  if (allEmpty) {
    setOtpError(false);     // remove red border indication
    setMessage("");         // clear error message
  }
};


  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
  e.preventDefault();
  const code = otp.join("");

  if (code.length !== 6) {
    alert("Please enter the 6-digit code");
    return;
  }

  if (!email) {
    alert("No email found. Please register again.");
    navigate("/signup");
    return;
  }

  setLoading(true);
  setMessage("");
  setOtpError(false); // reset error before new request

  try {
    const res = await fetch("https://vow-org.me/auth/verifyemail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    console.log("📡 Verify Response:", data);

    if (res.ok && data.success) {
      setMessage(" Email verified successfully!");
      setOtpError(false);
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setOtpError(true); // 🔴 show red border
      setMessage(`Invalid OTP`);
    }
  } catch (err) {
    console.error("Error verifying:", err);
    setOtpError(true);
    setMessage(" Network or server error.");
  } finally {
    setLoading(false);
  }
};


  const handleResend = async () => {
    if (!email || timer > 0) return; // ⛔ prevent spamming
    setTimer(30); // reset timer immediately
    try {
      const res = await fetch("https://vow-org.me/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.msg || "OTP resent!");
    } catch (err) {
      console.error(" Resend error:", err);
      setMessage(" Could not resend OTP.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-poppins"
      style={{
        background: "linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)",
      }}
    >
      <div className="bg-white p-6 sm:p-10 sm:pr-20 sm:pl-20 rounded-xl shadow-xl w-full max-w-[570px] relative mx-3">
        {/* Back Arrow */}
        <button
          className="absolute top-6 left-5 text-gray-900 text-3xl"
          onClick={() => navigate(-1)}
        >
          <img src={arrow} alt="Back" className="h-6 sm:h-8" />
        </button>

        {/* Logo */}
        <div className="flex justify-center pt-4">
          <img src={logo} alt="Logo" className="h-8 sm:h-10" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-[24px] sm:text-[32px] font-semibold text-gray-900 mt-4">
          Verify Your Email
        </h2>

        <p className="text-center text-[14px] sm:text-[16px] text-[#707070] mb-8 sm:mb-10">
          Please enter the code sent to your email
        </p>

        {/* OTP Inputs */}
        <form onSubmit={handleVerify} className="w-full">
          <div
    className=" items-center gap-[2vw] sm:gap-4 mb-8 sm:pb-8 sm:mb-8"
    style={{ flexWrap: "nowrap" }}
  >
    <div className="flex justify-between">
    {otp.map((digit, index) => (
  <input
    key={index}
    type="text"
    inputMode="numeric"
    maxLength="1"
    value={digit}
    onChange={(e) => handleChange(index, e.target.value)}
    onKeyDown={(e) => handleKeyDown(e, index)}
    onFocus={() => setIsFocused(true)}
    onBlur={() => setIsFocused(false)}
    ref={(el) => (inputRefs.current[index] = el)}
    className={`text-center border rounded-b-sm focus:outline-none transition-all duration-200 ${
      otpError
        ? "border-[#E63946] bg-[#FDEDEC]" // 🔴 error color
        : isFocused
        ? "border-[#5C0EA4] bg-[#E7DBF1]" // 🟣 focused
        : "border-[#D9D9D9] bg-[#F9F6FC]" // ⚪ normal
    }`}
    style={{
      width: "clamp(35px, 9vw, 56px)",
      height: "clamp(35px, 9vw, 56px)",
      fontSize: "clamp(14px, 4vw, 20px)",
    }}
  />
))}
</div>
<div className="flex pt-1 mb-0">
  <p
    className={`text-center text-sm sm:text-base ${
      otpError ? "text-[#E63946]" : "text-green-600"
    }`}
    style={{ minHeight: "1em" }} // ensures consistent height
  >
    {otpError ? message : " "} 
  </p>
</div>

  </div>
  

  

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-[18px] sm:text-[20px] bg-[#450B7B] text-white py-2.5 rounded-md font-normal hover:bg-[#3a0863] transition"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>

          {/* Resend OTP Button */}
          <div className="flex justify-center mt-4 text-[#450B7B]">
            <button
              type="button"
              onClick={handleResend}
              disabled={loading || timer > 0}
              className={`px-5 py-2 w-full sm:text-lg rounded-md font-medium border border-purple-700 text-[#450B7B] transition-all duration-200 ${
                timer > 0
                  ? "opacity-100 cursor-not-allowed"
                  :""
              }`}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </div>

          
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
