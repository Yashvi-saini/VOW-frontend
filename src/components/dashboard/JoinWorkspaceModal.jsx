import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { joinWorkspace } from "../../api/authApi.js";
import { setWorkspaceContext } from "../userslice";

const JoinWorkspaceModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      setError("Incorrect workspace id");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await joinWorkspace(inviteCode);
      const { workspace } = response.data;
      const { _id, inviteCode: code, workspaceName } = workspace;

      localStorage.setItem("workspaceId", _id);
      localStorage.setItem("inviteCode", code);
      dispatch(setWorkspaceContext({ workspaceId: _id, workspaceToken: null }));

      alert(`Joined workspace: ${workspaceName}`);
      onClose();
      navigate(`/workspace/${_id}/chat`);
    } catch (err) {
      setError("Incorrect workspace id");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInviteCode("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="w-[772px] relative p-8"
        style={{
          borderRadius: '16px',
          background: '#EFE7F6',
          boxShadow: '0 0 8px 0 rgba(17, 17, 26, 0.10), 0 1px 0 0 rgba(17, 17, 26, 0.05), 0 -23px 25px 0 rgba(191, 162, 225, 0.17) inset, 0 -36px 30px 0 rgba(204, 180, 227, 0.15) inset, 0 -79px 40px 0 rgba(204, 180, 227, 0.10) inset, 0 2px 1px 0 rgba(204, 180, 227, 0.06), 0 4px 2px 0 rgba(204, 180, 227, 0.09), 0 8px 4px 0 rgba(204, 180, 227, 0.09), 0 16px 8px 0 rgba(204, 180, 227, 0.09), 0 32px 16px 0 rgba(204, 180, 227, 0.09)'
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-4 text-[#000000]  text-3xl font-bold"
        >
          ×
        </button>

        <h2 className="text-[36px] font-bold text-center mb-8 text-[#000000]">
          Join a New Workspace
        </h2>

        {/* Workspace ID Input */}
        <div className="mb-6">
          <label className="block text-[24px] font-semibold mb-3 text-[#000000]">
            Workspace Id
          </label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => {
              setInviteCode(e.target.value);
              setError("");
            }}
            placeholder="Enter the unique id to join its workspace"
            className={`border rounded-lg px-4 py-3 w-full focus:outline-none text-[#585858] font-normal text-[16px] bg-[#EFE7F6] ${
              error
                ? "border-[#CC0404] focus:border-[#CC0404] focus:ring-2 focus:ring-[#CC0404]"
                : "border-[#BFA2E1] focus:border-[#5E9BFF]  "
            }`}
          />
          {error && (
            <p className="text-[#CC0404] text-[16px] mt-2">{error}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleClose}
            className="px-8 py-3 rounded-lg border text-[20px] border-[#CCB4E3] text-[#450B7B]  font-normal w-[220px] h-[44px] bg-[#FFF] "
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-[#5E9BFF] text-[20px] text-white hover:bg-[#4A8CE0] transition font-medium disabled:opacity-50 w-[220px] h-[44px]"
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
    </>
  );
};

export default JoinWorkspaceModal;
