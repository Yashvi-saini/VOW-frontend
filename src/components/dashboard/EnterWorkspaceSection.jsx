import React, { useState } from "react";
import { joinWorkspace } from "../../api/authApi"; // adjust path as needed
import { useNavigate } from "react-router-dom";

const EnterWorkspaceSection = () => {
  const [workspaceId, setWorkspaceId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!workspaceId.trim()) {
      alert("Please enter a valid Workspace ID.");
      return;
    }

    try {
      setLoading(true);
      const response = await joinWorkspace(workspaceId);
      const { workspace, workspaceToken } = response.data;

      localStorage.setItem("workspaceId", workspace._id || workspace.id);
      localStorage.setItem("workspaceToken", workspaceToken);

      alert("Successfully joined workspace!");
      navigate("/office"); // or wherever your workspace dashboard lives
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to join workspace.";
      alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10">
      <h2 className="text-2xl font-semibold mb-6 text-[#0E1219]">Enter Workspace</h2>
      <div className="max-w-md">
        <input
          type="text"
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
          placeholder="Enter Workspace ID"
          className="border border-gray-300 bg-[#EFE7F6] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#6B7280]"
        />
        <button
          onClick={handleJoin}
          disabled={loading}
          className="bg-[#5E9BFF] text-white px-8 py-3 rounded-lg mt-4 hover:bg-[#4A8CE0] transition font-medium"
        >
          {loading ? "Joining..." : "Enter"}
        </button>
      </div>
    </div>
  );
};

export default EnterWorkspaceSection;