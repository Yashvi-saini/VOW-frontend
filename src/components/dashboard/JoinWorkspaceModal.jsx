import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { joinWorkspace } from "../../api/workspaceApi.js";
import { setWorkspaceContext } from "../userslice";

const JoinWorkspaceModal = ({ isOpen, onClose, onWorkspaceJoined }) => {
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
    const codeToJoin = inviteCode.trim();
    if (!codeToJoin) {
      setError("Please enter a workspace ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await joinWorkspace(codeToJoin);
      const data = response.data;

      if (!data.success && data.msg === "User is already a member") {
        setError("You are already a member of this workspace");
        return;
      }

      if (data.success && data.workspace) {
        const { _id, inviteCode: code, workspaceName } = data.workspace;

        localStorage.setItem("workspaceId", _id);
        localStorage.setItem("inviteCode", code);
        dispatch(
          setWorkspaceContext({
            workspaceId: _id,
            workspaceToken: null,
            workspaceName,
          })
        );

        if (onWorkspaceJoined) onWorkspaceJoined();
        onClose();
        navigate(`/workspace/${_id}/chat`);
      } else {
        setError(data.message || data.msg || "Incorrect workspace ID");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        "Incorrect workspace ID";
      setError(msg);
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
        className="relative bg-[#EFE7F6] gradient rounded-2xl mx-auto my-24 w-[90%] sm:w-[600px] lg:w-[772px] p-6 sm:p-8 transition-all duration-300 z-50"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-[#000000] text-3xl font-bold hover:text-gray-700 cursor-pointer"
        >
          ×
        </button>

        <h2 className="text-[28px] sm:text-[36px] font-bold text-center mb-8 text-[#000000]">
          Join a New Workspace
        </h2>

        {/* Workspace ID Input */}
        <div className="mb-6">
          <label className="block text-[20px] sm:text-[24px] font-semibold mb-3 text-[#000000]">
            Workspace ID
          </label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => {
              setInviteCode(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJoin();
            }}
            placeholder="Enter the unique ID to join its workspace"
            className={`border rounded-lg px-4 py-3 w-full text-[#585858] font-normal text-[16px] bg-[#EFE7F6] focus:outline-none transition ${
              error
                ? "border-[#CC0404] focus:border-[#CC0404] focus:ring-2 focus:ring-[#CC0404]"
                : "border-[#BFA2E1] focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20"
            }`}
          />
          {error && (
            <p className="text-[#CC0404] text-[14px] sm:text-[16px] mt-2 font-medium">
              {error}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-[#CCB4E3] text-[#450B7B] font-normal w-full sm:w-[220px] h-[44px] text-[18px] bg-white hover:bg-[#f8f8f8] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleJoin}
            disabled={loading}
            className="rounded-lg bg-[#5E9BFF] text-white font-medium w-full sm:w-[220px] h-[44px] text-[18px] hover:bg-[#4A8CE0] disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
    </>
  );
};

export default JoinWorkspaceModal;
