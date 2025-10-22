import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import arrow from "../assets/arrow.svg";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused,setEmailFocused]=useState(false);
  const navigate = useNavigate();
 const trimmedEmail = email.trim();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setTouched(true);
  if (!email || !isEmailValid) return;

  setLoading(true);
  setServerMsg("");

  try {
    const trimmedEmail = email.trim(); // ensure clean email
    const res = await forgotPassword({ email: trimmedEmail });
    const data = res.data;

    if (data.success) {
      setServerMsg("");
      setTimeout(
        () => navigate("/verify-otp", { state: { email: trimmedEmail, mode: "forgot" } }),
        1200
      );
    } else {
      setServerMsg(` ${data.msg || "Failed to send OTP"}`);
    }
  } catch (err) {
    console.error("Forgot Password Error:", err);
    if (err.response && err.response.data) {
      setServerMsg(` ${err.response.data.msg || "Server error"}`);
    } else {
      setServerMsg(" Network or server error.");
    }
  } finally {
    setLoading(false);
  }
};

   
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-poppins"
      style={{
        background: "linear-gradient(235deg, #EFE7F6 36%, #BFA2E1 70%)",
      }}
    >
      <div className="bg-white pt-5 px-3 rounded-2xl shadow-xl w-full max-w-[570px] relative pb-10 sm:px-10 text-center box-border">
        {/* Close Button */}
        <div className="flex justify-start mt-5">
          <button
            className="text-gray-800 font-bold text-3xl mt-1 mr-2 pr-1 text-center"
            aria-label="Close"
            onClick={() => navigate(-1)}
          >
            <img src={arrow} alt="Back" className="h-6 sm:h-8" />
          </button>
        </div>

        <div className="px-6 sm:px-10 pb-10">
          {/* Logo */}
          <div className="flex justify-center mt-1">
            <img src="./logo.svg" alt="Logo" className="h-[35px] w-[51px]" />
          </div>

          {/* Heading */}
          <h2 className="text-center text-[32px] font-medium text-gray-900 mb-1">
            Forgot Password
          </h2>

          {/* Instruction */}
          <p className="text-center text-[17px] mb-8 text-gray-600">
            Please enter your registered email to receive a verification code.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="text-left relative">
            <div className="mb-4">
              <label className="block text-1xl font-bold text-gray-900 mb-1">
                Email:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value.trimStart());
                    setServerMsg(""); // <-- clear server message on change
                  }}
                  onClick={()=>(setEmailFocused(true))}
                  onBlur={() => setTouched(true)}
                  placeholder="Enter your email"
                  className={`w-full border rounded-lg px-2 py-2 text-[17px]  border-gray-400 focus:ring-[#5C0EA4] focus:outline-none focus:ring-2 transition ${
                      email && emailFocused // ✅ not empty AND not touched
                      ? "bg-[#F5F1FB] border-[#8F7AA9] focus:ring-[#558CE6]"
                      : emailFocused || email // when focused or typing
                      ? "border-[#558CE6] focus:ring-[#558CE6]"
                      : "border-gray-600 focus:ring-[#558CE6]"
                  }`}
                />
                
              </div>
              <p className="text-sm mt-1 min-h-[20px] text-red-500">
             {touched && !email
             ? "Please enter your email"
             : touched && email && !isEmailValid
              ? "Enter a valid email (e.g., abc@domain.com)"
              : serverMsg}
              </p>
            </div>

            <button
              type="submit"
              disabled={!email || !isEmailValid || loading}
              className={`w-full py-2 rounded-lg bg-[#450B7B] hover:bg-[#5d11a3] text-white font-normal text-[20px] mt-4 transition 
              `}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>

          {/* Back to login */}
          <p className="text-center text-[17px] text-[#707070] mt-1">
            <a href="/login" className="font-normal underline">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;