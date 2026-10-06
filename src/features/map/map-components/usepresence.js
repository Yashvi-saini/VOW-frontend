
import { useEffect } from "react";

export function usePresenceSync({ socket, workspaceId, setMembers }) {
  useEffect(() => {
    if (!socket || !workspaceId) {
      console.warn("⚠️ [usePresenceSync] Missing socket or workspaceId. Skipping setup.");
      return;
    }

    socket.emit("presence:join", { workspaceId });

    socket.on("presence:snapshot", (list) => {
      setMembers(list);
    });

    socket.on("presence:join", (member) => {
      setMembers((prev) => [...prev, member]);
    });

    socket.on("presence:leave", ({ userId }) => {
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    });

    socket.on("location:update", (update) => {
      setMembers((prev) =>
        prev.map((m) => (m.userId === update.userId ? { ...m, ...update } : m))
      );
    });

    return () => {
      socket.off("presence:snapshot");
      socket.off("presence:join");
      socket.off("presence:leave");
      socket.off("location:update");
    };
  }, [socket, workspaceId]);
}