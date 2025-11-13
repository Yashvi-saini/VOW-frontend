import React, { useEffect, useState, useRef } from "react";
import {
  getJoinedWorkspaces,
  rejoinWorkspace,
  deleteWorkspace,
} from "../../api/authApi";
import CreateAndJoin from "./createandjoin";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setWorkspaceContext } from "../userslice";
import CreateWorkspaceModal from "./CreateWorkspaceModal.jsx";

import CreateWorkspace from "./CreateWorkspace.jsx";
import Toast from "../common/Toast";

const RejoinAndFetch = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });
  const [rejoiningId, setRejoiningId] = useState(null);
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
        setToast({
          show: true,
          type: "error",
          message: "Failed to fetch workspaces",
        });
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      setToast({ show: true, type: "error", message: "Something went wrong" });
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
      const confirmed = window.confirm(
        "Are you sure you want to delete this workspace?"
      );
      if (confirmed) {
        deleteWorkspace(workspaceId)
          .then(() => {
            setToast({
              show: true,
              type: "success",
              message: "Workspace deleted successfully.",
            });
            setWorkspaces((prev) =>
              prev.filter((ws) => ws._id !== workspaceId)
            );
          })
          .catch((err) => {
  const serverMessage =
    err?.response?.data?.message ||
    err?.response?.data?.msg ||
    "Failed to delete workspace.";

  setToast({
    show: true,
    type: "error",
    message: serverMessage,
  });
});

      }
      clickCounts.current[workspaceId] = 0;
    } else {
      setTimeout(() => {
        clickCounts.current[workspaceId] = 0;
      }, 1000);
    }
  };

  const handleRejoin = async (wsOrId) => {
    const workspaceId = typeof wsOrId === "string" ? wsOrId : wsOrId?._id;
    const fallbackName =
      typeof wsOrId === "object" && wsOrId
        ? wsOrId.workspaceName
        : workspaces.find((w) => w._id === wsOrId)?.workspaceName;
    try {
      setRejoiningId(workspaceId);
      console.log("Rejoin requested for:", workspaceId);
      const response = await rejoinWorkspace(workspaceId);
      // Server refreshes HttpOnly cookie; no need to read token in JS
      const apiName =
        response?.data?.workspace?.workspaceName ||
        response?.data?.workspaceName;
      const resolvedName = apiName || fallbackName || null;
      console.log("Dispatching workspace context:", {
        workspaceId,
        workspaceName: resolvedName,
      });
      dispatch(
        setWorkspaceContext({
          workspaceId,
          workspaceToken: null,
          workspaceName: resolvedName,
        })
      );
      if (response.data?.success) {
        setToast({
          show: true,
          type: "success",
          message: `Rejoined workspace: ${resolvedName || workspaceId}`,
        });
        // Let the toast be visible briefly before navigating
        setTimeout(() => {
          navigate(`/workspace/${workspaceId}/chat?view=chat`);
        }, 1000);
      } else {
        setToast({
          show: true,
          type: "error",
          message: response.data?.message || "Failed to rejoin workspace",
        });
      }
    } catch (error) {
      console.error("Rejoin error:", error);
      setToast({
        show: true,
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    } finally {
      // If we navigate away, this doesn't matter; if not, we re-enable the button
      setTimeout(
        () => setRejoiningId((id) => (id === workspaceId ? null : id)),
        1100
      );
    }
  };

  const handleCopyInvite = async (code, e) => {
    // Prevent triggering the triple-click delete or rejoin handlers
    if (e) e.stopPropagation();
    const value = code || "";
    if (!value) {
      setToast({
        show: true,
        type: "error",
        message: "No invite code to copy",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setToast({ show: true, type: "success", message: "Invite code copied" });
    } catch (_) {
      setToast({ show: true, type: "error", message: "Copy failed" });
    }
  };

  // Auto-hide toast after a short delay – must be declared before any early return
  useEffect(() => {
    if (toast.show) {
      const id = setTimeout(
        () => setToast((t) => ({ ...t, show: false })),
        toast.type === "success" ? 1600 : 2000
      );
      return () => clearTimeout(id);
    }
  }, [toast.show, toast.type]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading workspaces...</p>;
  }

  if (workspaces.length === 0) {
    return (
      <>
        <CreateAndJoin onCreate={() => setModalOpen(true)} />
        {modalOpen && (
          <CreateWorkspaceModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onInvitesSent={fetchWorkspaces}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 overflow-x-auto hide-scrollbar m-5 sm:m-10  mb-12 bg-[#FEFEFE] rounded-xl">
        <div className="flex gap-8 ">
          {workspaces.map((ws) => (
            <div
              key={ws._id}
              onClick={() => handleTripleClick(ws._id)}
              className="min-w-[324px] min-h-[204px]  gradient  border-none rounded-2xl p-10 overflow-visible shadow-sm flex flex-col items-center justify-between cursor-pointer "
            >
              <h3 className="relative group text-2xl font-bold text-[#0E1219] mb-3 text-center max-w-full overflow-visible">
                <span className="truncate block max-w-full ">
                  {ws.workspaceName}
                </span>

                {/* Tooltip --- shows ONLY on hover heading */}
                <span
                  className="absolute left-1/2 -translate-x-1/2 -top-9 mt-2 
    hidden group-hover:block  text-[#5C0EA4] text-sm 
    px-2 py-1 rounded whitespace-normal w-full"
                >
                  {ws.workspaceName}
                </span>
              </h3>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-[16px] text-[#000 ]">Invite code:</span>
                <code className="text-sm font-semibold tracking-wider text-[#0E1219] bg-[#dcd3e4] px-2 py-1 rounded">
                  {ws.inviteCode ||
                    (ws._id === localStorage.getItem("workspaceId")
                      ? localStorage.getItem("inviteCode")
                      : "—")}
                </code>
                <button
                  onClick={(e) =>
                    handleCopyInvite(
                      ws.inviteCode || localStorage.getItem("inviteCode"),
                      e
                    )
                  }
                  className="ml-1 p-1 rounded hover:bg-white/60"
                  aria-label="Copy invite code"
                  title="Copy invite code"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-[#6B7280]"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejoin(ws);
                }}
                disabled={rejoiningId === ws._id}
                className={`min-w-[140px] bg-[#5E9BFF] text-white text-xl px-6 py-2.5  rounded-lg transition ${
                  rejoiningId === ws._id ? "opacity-70 " : "hover:bg-[#4A8CE0]"
                }`}
              >
                {rejoiningId === ws._id ? "Entering..." : "Enter Office"}
              </button>
            </div>
          ))}
        </div>
        {/* Toast notifications */}
        <Toast show={toast.show} type={toast.type} message={toast.message} />
      </div>

      {/* ✅ Modal OUTSIDE the grid */}
      {modalOpen && (
        <CreateWorkspaceModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onInvitesSent={fetchWorkspaces}
        />
      )}
    </>
  );
};

export default RejoinAndFetch;
