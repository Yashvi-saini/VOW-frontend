
import { useEffect } from "react";

export function usePresenceSync({ socket, workspaceId, setMembers }) {
  useEffect(() => {
    if (!socket || !workspaceId) {
      console.warn("⚠️ [usePresenceSync] Missing socket or workspaceId. Skipping setup.");
      return;
    }

    console.log("🔌 [usePresenceSync] Joining presence room:", workspaceId);
    socket.emit("presence:join", { workspaceId });

    socket.on("presence:snapshot", (list) => {
      console.log("📸 [presence:snapshot] Received full member list:", list);
      setMembers(list);
    });

    socket.on("presence:join", (member) => {
      console.log("➕ [presence:join] New member joined:", member);
      setMembers((prev) => [...prev, member]);
    });

    socket.on("presence:leave", ({ userId }) => {
      console.log("❌ [presence:leave] Member left:", userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    });

    socket.on("location:update", (update) => {
      console.log("📍 [location:update] Member moved:", update);
      setMembers((prev) =>
        prev.map((m) => (m.userId === update.userId ? { ...m, ...update } : m))
      );
    });

    return () => {
      console.log("🧹 [usePresenceSync] Cleaning up socket listeners");
      socket.off("presence:snapshot");
      socket.off("presence:join");
      socket.off("presence:leave");
      socket.off("location:update");
    };
  }, [socket, workspaceId]);
}