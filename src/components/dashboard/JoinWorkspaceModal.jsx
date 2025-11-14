import React, { useState, useEffect, useRef } from "react";
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
  const modalRef = useRef(null);

  // Scrolls main div so modal is vertically centered in the viewport
  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        const rect = modalRef.current.getBoundingClientRect();
        const scrollTop =
          window.scrollY +
          rect.top -
          (window.innerHeight - rect.height) / 2;
        window.scrollTo({
          top: Math.max(scrollTop, 0),
          behavior: "smooth",
        });
      }, 100);
    }
  }, [isOpen]);

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
      dispatch(
        setWorkspaceContext({
          workspaceId: _id,
          workspaceToken: null,
          workspaceName,
        })
      );

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
        ref={modalRef}
        className="relative bg-[#EFE7F6] gradient rounded-2xl mx-auto my-24 w-[90%] sm:w-[600px] lg:w-[772px] p-6 sm:p-8 transition-all duration-300"
        
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-[#000000] text-3xl font-bold"
        >
          ×
        </button>

        <h2 className="text-[28px] sm:text-[36px] font-bold text-center mb-8 text-[#000000]">
          Join a New Workspace
        </h2>

        {/* Workspace ID Input */}
        <div className="mb-6">
          <label className="block text-[20px] sm:text-[24px] font-semibold mb-3 text-[#000000]">
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
            className={`border rounded-lg px-4 py-3 w-full text-[#585858] font-normal text-[16px] bg-[#EFE7F6] focus:outline-none transition ${
              error
                ? "border-[#CC0404] focus:border-[#CC0404] focus:ring-2 focus:ring-[#CC0404]"
                : "border-[#BFA2E1] focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20"
            }`}
          />
          {error && (
            <p className="text-[#CC0404] text-[14px] sm:text-[16px] mt-2">
              {error}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={handleClose}
            className="rounded-lg border border-[#CCB4E3] text-[#450B7B] font-normal w-full sm:w-[220px] h-[44px] text-[18px] bg-white hover:bg-[#f8f8f8] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={loading}
            className="rounded-lg bg-[#5E9BFF] text-white font-medium w-full sm:w-[220px] h-[44px] text-[18px] hover:bg-[#4A8CE0] disabled:opacity-50 transition"
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
    </>
  );
};

export default JoinWorkspaceModal;
