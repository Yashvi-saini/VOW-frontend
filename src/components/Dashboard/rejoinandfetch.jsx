import React, { useEffect, useState } from "react";
import { getJoinedWorkspaces, rejoinWorkspace } from "../../api/authApi";
import CreateAndJoin from "../dashboard/createandjoin";

const RejoinAndFetch = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        const response = await getJoinedWorkspaces();
        if (response.data.success) {
          setWorkspaces(response.data.workspaces || []);
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

    fetchWorkspaces();
  }, []);

  const handleRejoin = async (workspaceId) => {
    try {
      const response = await rejoinWorkspace(workspaceId);
      if (response.data.success) {
        alert(`Rejoined workspace: ${response.data.workspaceName}`);
        // Optionally redirect or refresh
      } else {
        alert("Failed to rejoin workspace");
      }
    } catch (error) {
      console.error("Rejoin error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading workspaces...</p>;
  }

  if (workspaces.length === 0) {
    return <CreateAndJoin />;
  }

  return (
    <div className="overflow-x-auto py-4 px-2">
      <div className="flex gap-4">
        {workspaces.map((ws) => (
          <div
            key={ws._id}
            className="min-w-[250px] bg-white border border-[#BCBCBC] rounded-lg p-4 shadow-md flex flex-col justify-between"
          >
            <h3 className="text-lg font-semibold text-[#0E1219] mb-2">{ws.workspaceName}</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Last active: {ws.lastActive || "Unknown"}
            </p>
            <button
              onClick={() => handleRejoin(ws._id)}
              className="bg-[#5E9BFF] text-white px-4 py-2 rounded-md hover:bg-[#4A8CE0] transition"
            >
              Rejoin
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RejoinAndFetch;