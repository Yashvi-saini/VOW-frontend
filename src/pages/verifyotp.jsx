import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import arrow from "../assets/arrow.svg"

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email; // ✅ email passed from signup

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
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

    try {
      const res = await fetch("https://vow-org.me/auth/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      console.log("📡 Verify Response:", data);

      if (res.ok && data.success) {
        setMessage("✅ Email verified successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(`❌ ${data.msg || "Verification failed"}`);
      }
    } catch (err) {
      console.error("❌ Error verifying:", err);
      setMessage("⚠️ Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      const res = await fetch("https://vow-org.me/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.msg || "OTP resent!");
    } catch (err) {
      console.error("❌ Resend error:", err);
      setMessage("⚠️ Could not resend OTP.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-poppins"
      style={{
        background: "linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)",
      }}
    >
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-[570px] relative">
        <button className="absolute top-9 left-5 text-gray-900 text-3xl">
          <img src={arrow} alt="Logo" className="h-8" />
        </button>

        <div className="flex justify-center pt-5.5">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        <h2 className="text-center text-[32px] font-semibold text-gray-900">
          Verify Your Email
        </h2>

        <p className="text-center text-[16px] text-[#707070] mb-11.5">
          Please enter the code sent to your email
        </p>

        <form onSubmit={handleVerify} className="mr-10 ml-10">
          <div className="flex justify-center gap-3  mb-8 box-border">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-14 h-14 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-[20px] bg-[#450B7B] text-white py-2.5 rounded-md font-normal hover:bg-[#3a0863] transition"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <p className="text-center text-[16px] text-[#707070] mt-4">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-purple-700 font-normal hover:underline"
              style={{ color: "#707070" }}
            >
              Resend OTP
            </button>
          </p>

          {message && (
            <p className="text-center mt-4" style={{ color: message.startsWith("✅") ? "green" : "red" }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
