import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token if you're storing it
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center"
      style={{
        background: "linear-gradient(135deg, #EFE7F6 30%, #BFA2E1 70%)",
      }}
    >
      <div className="bg-white shadow-xl rounded-2xl p-10 w-[90%] max-w-[600px]">
        <h1 className="text-3xl font-semibold text-[#450B7B] mb-4">
          Welcome to Dashboard 
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          You have successfully logged in.
        </p>

        <button
          onClick={handleLogout}
          className="bg-[#450B7B] text-white py-2 px-6 rounded-md hover:bg-[#5c0ea4] transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
