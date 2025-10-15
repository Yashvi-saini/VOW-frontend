import React from "react";
import checkIcon from "../assets/bigtick.png"; 

const ResetSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 px-4">
      <div
        className="relative flex flex-col justify-between items-center rounded-[12px] bg-[#FAFAFA] shadow-lg"
        style={{
          width: "570px",
          height: "513px",
          padding: "20px 40px 40px 40px",
        }}
      >
        {/* Close (X) button */}
        <button className="absolute top-[18px] right-[47px] text-gray-500 text-3xl hover:text-gray-700 ">
          ×
        </button>

        {/* Check Image */}
        <div className="flex items-center justify-center mt-12">
          <img
            src={checkIcon}
            alt="Success"
            className="w-[120px] h-[120px] object-contain"
          />
        </div>

        {/* Text Section */}
        <div className="text-center mt-6">
          <h2 className="text-[24px] font-semibold text-black mb-2"
          style={{color: '#1F2937',
          textAlign: 'center',
          fontFamily: 'Poppins',
          fontSize: '32px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: 'normal'}}>
            Password Changed
          </h2>
          <p className="text-[#707070] text-[16px]"
          style={{fontFamily: 'poppins'}}>
            You have successfully changed your password
          </p>
        </div>

        {/* Button */}
        <a
          href="/login"
          className="w-full mt-8 bg-[#450B7B] text-white text-[16px] py-[10px] rounded-md font-medium hover:bg-[#4B0FB0] transition text-center"
        >
          Back to login
        </a>
      </div>
    </div>
  );
};

export default ResetSuccess;
