import React, { useState } from "react";
import { createWorkspace } from "../../api/authApi"; // adjust path as needed
import { useDispatch } from "react-redux";
import { setWorkspaceContext } from "../userslice"; // normalized path
const CreateWorkspace = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleCreate = async () => {
    const inviteEmails = emails
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    try {
      setLoading(true);
  const response = await createWorkspace({ workspaceName, inviteEmails });
  const { workspace } = response.data; // token is set as HttpOnly cookie
      const workspaceId = workspace._id || workspace.id;
      const inviteCode = workspace.inviteCode;
console.log("Checking token for:", workspaceId);
      localStorage.setItem("workspaceId", workspaceId);
      localStorage.setItem("inviteCode", inviteCode);
  // Workspace auth token is provided as HttpOnly cookie by the server.
  // Do not attempt to read/store it in JS. Axios is configured with withCredentials: true,
  // so subsequent workspace-scoped requests will include the cookie automatically.
  console.log("Dispatching workspace context:", { workspaceId });
  dispatch(setWorkspaceContext({ workspaceId, workspaceToken: null }));
      alert("Workspace created successfully!");
      setWorkspaceName("");
      setEmails("");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Workspace creation failed.";
      alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 ml-[71px]">
      <div className="max-w-lg space-y-6 bg-[#EFE7F6] px-6 py-6 rounded-2xl">
        <h2 className="text-[36px] font-bold mb-6 text-[#000]">Create a New Workspace</h2>

        {/* Workspace Name */}
        <div>
          <label className="block text-[24px] font-semibold mb-2 text-[#000]">Workspace Name</label>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="e.g. Design Studio, Growth Team, Marketing Hub"
            className="border border-[#707070] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#707070] bg-[#EFE7F6] font-normal"
          />
        </div>

        {/* Logo Picker (UI only) */}
        <div>
          <label className="block font-semibold border-[#707070] text-[24px] mb-2 text-[#000]">Choose Workspace Logo</label>
          <div className="flex items-center gap-4">
            <button className="text-xl font-bold text-[#5E9BFF] hover:text-[#4A8CE0]">{"<"}</button>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-gray-300 hover:bg-[#5E9BFF] cursor-pointer transition-all"></div>
              ))}
            <button className="text-xl font-bold text-[#5E9BFF] hover:text-[#4A8CE0]">{">"}</button>
          </div>
        </div>

        {/* Total Members (UI only) */}
      

        {/* Email Input */}
        <div>
          <label className="block text-[24px] font-semibold mb-2 text-[#000]">Invite Members (comma-separated emails)</label>
          <input
            type="text"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="e.g. user1@example.com, user2@example.com"
            className="border border-[#707070] rounded-lg px-4 py-3 w-full focus:outline-none focus:border-[#5E9BFF] focus:ring-2 focus:ring-[#5E9BFF]/20 text-[#707070] bg-[#EFE7F6] font-normal"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-[#5E9BFF] text-white px-8 py-3 rounded-lg mt-6 hover:bg-[#4A8CE0] transition font-medium"
        >
          {loading ? "Creating..." : "Create Workspace"}
        </button>
      </div>
    </div>
  );
};

export default CreateWorkspace;