import React, { useState } from "react";
import { joinWorkspace } from "../../api/authApi"; 
import { useNavigate } from "react-router-dom";


const EnterWorkspaceSection = ({ onClose }) => {
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
      navigate("/office");
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

  const closeModal = () => {
    if (onClose) return onClose();
    navigate("/dashboard");
  };

  return (
    <>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="w-full max-w-[772px] rounded-2xl bg-[#EFE7F6] shadow-xl px-8 py-6 relative flex flex-col items-center gap-10"
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            aria-label="Close"
            onClick={closeModal}
          >
            ×
          </button>

          {/* Title */}
          <h2 className="text-[36px] sm:text-[26px] md:text-[28px] font-bold text-black text-center leading-43.2 ">
            Join a New Workspace
          </h2>

          {/* Form */}
          <div className="w-full flex flex-col gap-4">
            <label className="block text-[24px] font-semibold text-black">Workspace Id</label>
            <input
              type="text"
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              placeholder="Enter the unique id to join its workspace"
              className="border border-[#BFA2E1] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#374151] bg-[#EFE7F6] font-normal text-[16px]"
            />
          </div>

          {/* Actions */}
          <div className="w-full flex items-center justify-center gap-4">
            <button
              onClick={closeModal}
              className="w-[220px] h-[44px] bg-[#FFF] text-[#450B7B] px-6 py-3 rounded-lg font-normal text-[20px] justify-center flex items-center "
            >
              Cancel
            </button>
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-[220px] h-[44px] bg-[#5E9BFF] text-white px-6 py-3 rounded-lg font-normal  text-[20px] justify-center flex items-center "
            >
              {loading ? "Joining..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnterWorkspaceSection;