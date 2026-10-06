import { useEffect, useState, useRef } from "react";
import { getMembers } from "../api/workspaceApi";
import socket, { connectSocket } from "@/components/chat/socket";
export const useMembers = (workspaceId) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const onlineSetRef = useRef(new Set());

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!workspaceId) {
        throw new Error("Missing workspaceId");
      }
      const response = await getMembers(workspaceId);
      if (response.data?.success) {
        const raw = response.data.members || [];
        const normalized = raw.map((m) => {
          const stableId = m._id || m.id || m.userId || null;
          const isOnline = onlineSetRef.current.has(String(stableId));
          return { ...m, _id: stableId, online: isOnline };
        });
        setMembers(normalized);
        if (socket && socket.connected) {
          socket.emit("get_online_users", String(workspaceId));
        }
      } else {
        throw new Error(response.data?.message || "Failed to fetch members");
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) fetchMembers();
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId) return;
    const wsId = String(workspaceId);
    onlineSetRef.current = new Set();
    setMembers((prev) => prev.map((m) => ({ ...m, online: false })));

    connectSocket();

    // Register presence for this workspace and request its online list.
    // Re-run on (re)connect since the server forgets rooms on disconnect.
    const announce = () => {
      socket.emit("join_workspace_presence", wsId);
      socket.emit("get_online_users", wsId);
    };
    if (socket.connected) announce();
    socket.on("connect", announce);

    const handleUserOnline = ({ userId, workspaceId: evWs }) => {
      // Global (no workspaceId) events only mean "connected to the app"
      if (!evWs || String(evWs) !== wsId) return;
      if (userId) {
        onlineSetRef.current.add(String(userId));
      }
      setMembers((prev) =>
        prev.map((m) =>
          String(m._id) === String(userId) ? { ...m, online: true } : m
        )
      );
    };

    const handleUserOffline = ({ userId, workspaceId: evWs }) => {
      if (evWs && String(evWs) !== wsId) return;
      if (userId) {
        onlineSetRef.current.delete(String(userId));
      }
      setMembers((prev) =>
        prev.map((m) =>
          String(m._id) === String(userId) ? { ...m, online: false } : m
        )
      );
    };

    const handleOnlineList = (userList) => {
      if (Array.isArray(userList)) {
        const set = new Set(userList.map((id) => String(id)));
        onlineSetRef.current = set;
        setMembers((prev) =>
          prev.map((m) => ({
            ...m,
            online: set.has(String(m._id)),
          }))
        );
      }
    };

    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);
    socket.on("online_users_list", handleOnlineList);

    return () => {
      socket.off("connect", announce);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      socket.off("online_users_list", handleOnlineList);
    };
  }, [workspaceId]);

  return { members, loading, error, fetchMembers };
};

export default useMembers;