import React, { useEffect, useState } from "react";
import { getJoinedWorkspaces, rejoinWorkspace,deleteWorkspace } from "../../api/authApi";
import CreateAndJoin from "./createandjoin";
const RejoinAndFetch = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
const [clickCounts, setClickCounts] = useState({});

const handleTripleClick = async (workspaceId) => {
  setClickCounts((prev) => {
    const count = (prev[workspaceId] || 0) + 1;

    if (count === 3) {
      const confirmed = window.confirm("Are you sure you want to delete this workspace?");
      if (confirmed) {
        // ✅ Move deletion logic outside setClickCounts
        (async () => {
          try {
            await deleteWorkspace(workspaceId);
            alert("Workspace deleted successfully.");
            setWorkspaces((prevWs) => prevWs.filter((ws) => ws._id !== workspaceId));
          } catch (err) {
            alert(err.message || "Failed to delete workspace.");
          }
        })();
      }
      return { ...prev, [workspaceId]: 0 };
    }

    setTimeout(() => {
      setClickCounts((prevReset) => ({ ...prevReset, [workspaceId]: 0 }));
    }, 1000);

    return { ...prev, [workspaceId]: count };
  });
};
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
      const existingToken = localStorage.getItem(`workspaceToken_${workspaceId}`);
      console.log("Rejoin requested for:", workspaceId, "existing token:", !!existingToken);
      const response = await rejoinWorkspace(workspaceId);
      // If backend returns a fresh workspace token, persist it
      const newToken = response?.data?.workspaceToken;
      if (newToken) {
        localStorage.setItem(`workspaceToken_${workspaceId}`, newToken);
        console.log("Stored refreshed workspace token for", workspaceId);
      }
      if (response.data?.success) {
        alert(`Rejoined workspace: ${response.data.workspaceName || workspaceId}`);
        // Optionally redirect or refresh
      } else {
        alert(response.data?.message || "Failed to rejoin workspace");
      }
    } catch (error) {
      console.error("Rejoin error:", error);
      alert(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading workspaces...</p>;
  }

  if (workspaces.length === 0) {
    return <CreateAndJoin />;
  }

  return (
    <div className="grid grid-cols-3 overflow-x-scroll py-4 px-2">
      <div className="flex gap-4">
        {workspaces.map((ws) => (
          <div
  key={ws._id}
  onClick={() => handleTripleClick(ws._id)}
  className="min-w-[250px] bg-white border border-[#BCBCBC]  rounded-lg p-4 shadow-md flex flex-col justify-between cursor-pointer"
>
            <h3 className="text-lg font-semibold text-[#0E1219] mb-2">{ws.workspaceName}</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Last active: {ws.lastActive || "Unknown"}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); handleRejoin(ws._id); }}
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