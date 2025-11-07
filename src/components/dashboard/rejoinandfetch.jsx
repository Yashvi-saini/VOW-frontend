import React, { useEffect, useState, useRef } from "react";
import { getJoinedWorkspaces, rejoinWorkspace, deleteWorkspace } from "../../api/authApi";
import CreateAndJoin from "./createandjoin";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setWorkspaceContext } from "../userslice";

import CreateWorkspace from "./CreateWorkspace.jsx";  

const RejoinAndFetch = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const clickCounts = useRef({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
const [modalOpen, setModalOpen] = useState(false);
  
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

  useEffect(() => {
  fetchWorkspaces();
}, []);

  const handleTripleClick = (workspaceId) => {
    const count = (clickCounts.current[workspaceId] || 0) + 1;
    clickCounts.current[workspaceId] = count;

    if (count === 3) {
      const confirmed = window.confirm("Are you sure you want to delete this workspace?");
      if (confirmed) {
        deleteWorkspace(workspaceId)
          .then(() => {
            alert("Workspace deleted successfully.");
            setWorkspaces((prev) => prev.filter((ws) => ws._id !== workspaceId));
          })
          .catch((err) => {
            alert(err.message || "Failed to delete workspace.");
          });
      }
      clickCounts.current[workspaceId] = 0;
    } else {
      setTimeout(() => {
        clickCounts.current[workspaceId] = 0;
      }, 1000);
    }
  };

  const handleRejoin = async (workspaceId) => {
    try {
      console.log("Rejoin requested for:", workspaceId);
      const response = await rejoinWorkspace(workspaceId);

      console.log("Dispatching workspace context:", { workspaceId });
      dispatch(setWorkspaceContext({ workspaceId, workspaceToken: null }));
      if (response.data?.success) {
        alert(`Rejoined workspace: ${response.data.workspaceName || workspaceId}`);
        setTimeout(() => {
    navigate(`/workspace/${workspaceId}/chat`);
  }, 0);

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
    return <CreateAndJoin onCreate={() => setModalOpen(true)} />;
  }

  return (
  <>
    {/* Workspaces Grid */}
    <div className="grid grid-cols-3 overflow-x-scroll py-4 px-2">
      <div className="flex gap-4">
        {workspaces.map((ws) => (
          <div
            key={ws._id}
            onClick={() => handleTripleClick(ws._id)}
            className="min-w-[250px] bg-white border border-[#BCBCBC] rounded-lg p-4 shadow-md flex flex-col justify-between cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-[#0E1219] mb-2">
              {ws.workspaceName}
            </h3>

            <p className="text-sm text-[#6B7280] mb-4">
              Last active: {ws.lastActive || "Unknown"}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRejoin(ws._id);
              }}
              className="bg-[#5E9BFF] text-white px-4 py-2 rounded-md hover:bg-[#4A8CE0] transition"
            >
              Rejoin
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* Modal when creating a workspace */}
    {modalOpen && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
        <div className="bg-white rounded-xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <button
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => setModalOpen(false)}
          >
            ✕
          </button>
          <CreateWorkspace onCreated={() => { setModalOpen(false); fetchWorkspaces(); }} />
        </div>
      </div>
    )}
  </>
);

};

export default RejoinAndFetch;