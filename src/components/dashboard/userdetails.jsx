import React, { useState } from "react";
import { getJoinedWorkspaces } from "../../api/authApi"; 
import { rejoinWorkspace } from "../../api/authApi.js";
const JoinedWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);

  const handleFetchWorkspaces = async () => {
    setLoading(true);
    try {
      const response = await getJoinedWorkspaces();
      if (response.data.success) {
        setWorkspaces(response.data.workspaces);
        setShowList(true);
      } else {
        alert("Failed to fetch workspaces");
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleRejoin = async (workspaceId) => {
    try {
      const response = await rejoinWorkspace(workspaceId);
      if (response.data.success) {
        alert(`Rejoined workspace: ${response.data.workspaceName}`);
      } else {
        alert("Failed to rejoin workspace");
      }
    } catch (error) {
      console.error("Rejoin error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[#450B7B] mb-4 text-center">
          Joined Workspaces
        </h2>

        <button
          onClick={handleFetchWorkspaces}
          disabled={loading}
          className="w-full bg-[#450B7B] text-white px-4 py-2 rounded-md hover:bg-[#5c0ea4] transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Show My Workspaces"}
        </button>

        {showList && (
          <ul className="mt-6 space-y-4">
            {workspaces.length === 0 ? (
              <p className="text-center text-gray-600">No workspaces found.</p>
            ) : (
              workspaces.map((ws) => (
                <li
                  key={ws._id}
                  onClick={() => handleRejoin(ws._id)}
                  className="cursor-pointer border border-[#BCBCBC] rounded-lg p-4 bg-[#F9F9FB] hover:bg-[#ECE6F6] transition"
                >
                  <h3 className="text-lg font-semibold text-[#370862]">
                    {ws.workspaceName}
                  </h3>
                  <p className="text-sm text-gray-700">
                    Invited by: <strong>{ws.inviterName}</strong>
                  </p>
                  <p className="text-sm text-gray-700">
                    Manager: <strong>{ws.manager}</strong>
                  </p>
                  <ul className="mt-2 list-disc list-inside">
                    {ws.members.map((member) => (
                      <li key={member._id} className="text-sm text-gray-700">
                        {member.fullName} ({member.email})
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-700">
                    Invite Code: <code>{ws.inviteCode}</code>
                  </p>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JoinedWorkspaces;
