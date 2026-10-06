import React, { useState } from "react";
import { joinWorkspace } from "@/api/workspaceApi"; 
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setWorkspaceContext } from "@/features/auth";

const EnterWorkspaceSection = ({ onClose }) => {
  const [workspaceId, setWorkspaceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoin = async () => {
    const codeToJoin = workspaceId.trim();
    if (!codeToJoin) {
      setError("Please enter a valid Workspace ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await joinWorkspace(codeToJoin);
      const data = response.data;

      if (!data.success && data.msg === "User is already a member") {
        setError("You are already a member of this workspace");
        return;
      }

      if (data.success && data.workspace) {
        const { _id, inviteCode, workspaceName } = data.workspace;
        localStorage.setItem("workspaceId", _id);
        localStorage.setItem("inviteCode", inviteCode);
        dispatch(
          setWorkspaceContext({
            workspaceId: _id,
            workspaceToken: null,
            workspaceName,
          })
        );
        if (onClose) onClose();
        navigate(`/workspace/${_id}/chat`);
      } else {
        setError(data.message || data.msg || "Failed to join workspace.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Failed to join workspace.";
      setError(msg);
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
        <div className="w-full max-w-[48.25rem] rounded-2xl bg-[#EFE7F6] shadow-xl px-8 py-6 relative flex flex-col items-center gap-10">
          
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
            aria-label="Close"
            onClick={closeModal}
          >
            ×
          </button>

          <h2 className="text-[2.25rem] sm:text-[1.625rem] md:text-[1.75rem] font-bold text-black text-center">
            Join a New Workspace
          </h2>

          <div className="w-full flex flex-col gap-4">
            <label className="block text-[1.5rem] font-semibold text-black">Workspace ID</label>
            <input
              type="text"
              value={workspaceId}
              onChange={(e) => {
                setWorkspaceId(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoin();
              }}
              placeholder="Enter the unique ID to join its workspace"
              className="border border-[#BFA2E1] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#374151] bg-[#EFE7F6] font-normal text-[1rem]"
            />
            {error && (
              <p className="text-[#CC0404] text-[0.875rem] font-medium">{error}</p>
            )}
          </div>

          <div className="w-full flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="w-[13.75rem] h-[2.75rem] bg-[#FFF] text-[#450B7B] px-6 py-3 rounded-lg font-normal text-[1.25rem] justify-center flex items-center cursor-pointer border border-[#CCB4E3]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleJoin}
              disabled={loading}
              className="w-[13.75rem] h-[2.75rem] bg-[#5E9BFF] text-white px-6 py-3 rounded-lg font-normal text-[1.25rem] justify-center flex items-center disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnterWorkspaceSection;