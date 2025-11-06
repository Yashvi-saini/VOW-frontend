import React, { useState } from "react";
import { createWorkspace } from "../../api/authApi";
import { useDispatch } from "react-redux";
import { setWorkspaceContext } from "../userslice";

const CreateWorkspaceModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Create Workspace, 2: Add Members
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(2);
  const [selectedMembers, setSelectedMembers] = useState("41-60");
  const [emails, setEmails] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const logos = Array(7).fill(0); // 7 logo options
  const memberRanges = ["<20", "21-40", "41-60", "61-80"];

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      alert("Please enter a workspace name");
      return;
    }

    try {
      setLoading(true);
      const response = await createWorkspace({ 
        workspaceName, 
        inviteEmails: [] // Empty for now, will add later
      });
      const { workspace } = response.data;
      const wsId = workspace._id || workspace.id;
      const wsInviteCode = workspace.inviteCode;

      setWorkspaceId(wsId);
      setInviteCode(wsInviteCode);
      
      localStorage.setItem("workspaceId", wsId);
      localStorage.setItem("inviteCode", wsInviteCode);
      
      dispatch(setWorkspaceContext({ workspaceId: wsId, workspaceToken: null }));
      
      // Move to step 2
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Workspace creation failed.";
      alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    alert("Workspace ID copied to clipboard!");
  };

  const handleSendInvites = () => {
    // Logic to send email invites
    alert("Invites sent successfully!");
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setWorkspaceName("");
    setSelectedLogo(2);
    setSelectedMembers("41-60");
    setEmails("");
    setWorkspaceId("");
    setInviteCode("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="w-[772px] relative"
        style={{
          borderRadius: '16px',
          background: '#EFE7F6',
          boxShadow: '0 0 8px 0 rgba(17, 17, 26, 0.10), 0 1px 0 0 rgba(17, 17, 26, 0.05), 0 -23px 25px 0 rgba(191, 162, 225, 0.17) inset, 0 -36px 30px 0 rgba(204, 180, 227, 0.15) inset, 0 -79px 40px 0 rgba(204, 180, 227, 0.10) inset, 0 2px 1px 0 rgba(204, 180, 227, 0.06), 0 4px 2px 0 rgba(204, 180, 227, 0.09), 0 8px 4px 0 rgba(204, 180, 227, 0.09), 0 16px 8px 0 rgba(204, 180, 227, 0.09), 0 32px 16px 0 rgba(204, 180, 227, 0.09)'
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#000]  font-bold text-3xl"
        >
          ×
        </button>

        {step === 1 ? (
          // Step 1: Create New Workspace
          <div className="p-8">
            <h2 className="text-[36px] font-bold text-center mb-8 text-[#000000]">
              Create a New Workspace
            </h2>

            {/* Workspace Name */}
            <div className="mb-6">
              <label className="block text-[24px] font-medium mb-3 text-[#000000]">
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

            {/* Choose Workspace Logo */}
            <div className="mb-6">
              <label className="block text-[24px] font-semibold mb-3 text-[#000000]">
                Choose Workspace Logo
              </label>
              <div className="flex items-center justify-center gap-4">
                <button className="text-7xl mb-[9px] text-[#000] ">
                  ‹
                </button>
                {logos.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedLogo(i)}
                    className={`w-18 h-18 rounded-full cursor-pointer transition-all ${
                      selectedLogo === i
                        ? "bg-[#D9D9D9] ring-2 ring-[#585858]"
                        : "bg-[#D9D9D9] ring-2 ring-[#585858]"
                    }`}
                  ></div>
                ))}
                <button className="text-7xl mb-[9px] text-[#000] ">
                  ›
                </button>
              </div>
            </div>

            {/* Total Members */}
            <div className="mb-8">
              <label className="block text-[24px] font-semibold mb-3 text-[#000000]">
                Total Members
              </label>
              <div className="bg-[#FEFEFE]  rounded-lg">

              <div className="flex gap-2 justify-center">
                {memberRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedMembers(range)}
                    className={`px-6 py-2 rounded-lg transition-all text-[14px] font-medium w-[174px] h-[39px] ${
                      selectedMembers === range
                        ? "bg-[#EBE2F6]  border border-[#5C0EA4] text-[#5C0EA4]"
                        : "bg-white   text-[#707070] hover:border-[#707070]"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleClose}
                className=" rounded-lg border border-[#CCB4E3] text-[#450B7B] font-normal w-[220px] h-[44px] bg-[#FFF] text-[20px]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkspace}
                disabled={loading}
                className=" rounded-lg bg-[#5E9BFF] text-white  font-medium text-[20px] w-[220px] h-[44px]"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        ) : (
          // Step 2: Add Members to Workspace
          <div className="p-8">
            <h2 className="text-[36px] font-bold text-center mb-8 text-[#000000]">
              Add Members to Workspace
            </h2>

            {/* Copy Workspace ID */}
            <div className="mb-6">
              <label className="block text-[24px] font-semibold mb-3 text-[#000000]">
                Copy Workspace id
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#EFE7F6] border border-[#BFA2E1] rounded-lg px-4 py-3 text-[#6B7280] flex items-center justify-between w-[708px] h-[51px]">
                  <span className="text-sm">{inviteCode || "http://vow-131"}</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-[#BFA2E1]"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </div>
                <button
                  onClick={handleCopyInviteCode}
                  className="p-3 hover:bg-gray-100 rounded-lg transition "
                >
                </button>
              </div>
            </div>

            {/* Send Email Invites */}
            <div className="mb-8">
              <label className=" block text-[24px] font-semibold mb-3 text-[#000000]">
                Send Email Invites
              </label>
              <input
                type="text"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="Enter email to join members"
                className="border border-[#BFA2E1] rounded-lg px-4 py-3  text-[#6B7280] bg-[#EFE7F6] w-[708px] h-[51px]"
              />
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSendInvites}
                className="px-8 py-3 rounded-lg bg-[#FFFFFF] text-[#450B7B] font-normal w-[220px] h-[44px]"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateWorkspaceModal;
