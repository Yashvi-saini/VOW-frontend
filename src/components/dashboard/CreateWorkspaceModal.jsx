import React, { useState } from "react";
import { createWorkspace } from "../../api/authApi"; // adjust path as needed
import { useDispatch } from "react-redux";
import { setWorkspaceContext } from "../userslice";
import Toast from "../common/Toast";

const CreateWorkspaceModal = ({ isOpen, onClose }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "info", message: "" });
  const dispatch = useDispatch();

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      setToast({ show: true, type: "error", message: "Please enter a workspace name" });
      return;
    }
    const inviteEmails = emails
      .split(/[\n,;\s]+/)
      .map(e => e.trim())
      .filter(e => e.length > 0);
    const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const invalid = inviteEmails.filter(e => !isEmail(e));
    if (invalid.length) {
      setToast({ show: true, type: "error", message: `Invalid email(s): ${invalid.slice(0,3).join(', ')}${invalid.length>3?'…':''}` });
      return;
    }
    try {
      setLoading(true);
      const response = await createWorkspace({ workspaceName, inviteEmails });
  const { workspace } = response.data;
      const wsId = workspace._id || workspace.id;
      const wsInviteCode = workspace.inviteCode;
  const managerId = workspace.manager || workspace.managerId || workspace.ownerId || null;
      localStorage.setItem("workspaceId", wsId);
      localStorage.setItem("inviteCode", wsInviteCode);
  dispatch(setWorkspaceContext({ workspaceId: wsId, workspaceToken: null, workspaceName, workspaceManagerId: managerId }));
      setToast({ show: true, type: "success", message: `Workspace created. Invites: ${inviteEmails.length}. Code: ${wsInviteCode}` });
      setTimeout(() => handleClose(), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Workspace creation failed.";
      setToast({ show: true, type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setWorkspaceName("");
    setEmails("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="w-[772px] relative"
        style={{
          borderRadius: "16px",
          background: "#EFE7F6",
          boxShadow:
            "0 0 8px 0 rgba(17,17,26,0.10), 0 1px 0 0 rgba(17,17,26,0.05), 0 -23px 25px 0 rgba(191,162,225,0.17) inset, 0 -36px 30px 0 rgba(204,180,227,0.15) inset, 0 -79px 40px 0 rgba(204,180,227,0.10) inset, 0 2px 1px 0 rgba(204,180,227,0.06), 0 4px 2px 0 rgba(204,180,227,0.09), 0 8px 4px 0 rgba(204,180,227,0.09), 0 16px 8px 0 rgba(204,180,227,0.09), 0 32px 16px 0 rgba(204,180,227,0.09)",
        }}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-black font-bold text-3xl"
        >
          ×
        </button>
        <div className="p-8">
          <h2 className="text-[36px] font-bold text-center mb-8 text-black">
            Create a New Workspace
          </h2>
          <div className="mb-6">
            <label className="block text-[24px] font-medium mb-3 text-black">
              Workspace Name
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="e.g. Design Studio, Growth Team, Marketing Hub"
              className="border border-[#BFA2E1] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#585858] bg-[#EFE7F6]"
            />
          </div>
          <div className="mb-8">
            <label className="block text-[24px] font-medium mb-3 text-black">
              Invite Members (optional)
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="Enter email addresses separated by commas, spaces or new lines"
              className="border border-[#BFA2E1] rounded-lg px-4 py-3 w-full h-28 max-h-48 resize-y overflow-auto focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#585858] bg-[#EFE7F6]"
            />
            <p className="mt-2 text-xs text-[#707070]">
              Invites will be sent immediately when the workspace is created.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleClose}
              className="rounded-lg border border-[#CCB4E3] text-[#450B7B] font-normal w-[220px] h-11 bg-white text-[20px]"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateWorkspace}
              disabled={loading}
              className="rounded-lg bg-[#5E9BFF] text-white font-medium text-[20px] w-[220px] h-11 disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
      <Toast show={toast.show} type={toast.type} message={toast.message} />
    </>
  );
};

export default CreateWorkspaceModal;