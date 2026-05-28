import { useEffect } from "react";
import socket, {
  joinDMWorkspace,
  onReceiveDirectMessage,
  offReceiveDirectMessage,
  onDMDeleted,
  offDMDeleted,
} from "../socket";

export const useChatSocket = ({
  isDMMode,
  workspaceId,
  activeRoomId,
  setMessages,
}) => {
  useEffect(() => {
    if (!socket) return;

    if (isDMMode && workspaceId) {
      joinDMWorkspace(workspaceId);

      const handleDM = (msg) => {
        setMessages((prev) => {
          if (msg._id && prev.some((m) => m._id === msg._id)) {
            return prev;
          }
          return [...prev, msg];
        });
      };

      onReceiveDirectMessage(handleDM);

      return () => {
        offReceiveDirectMessage();
        offDMDeleted();
      };
    } else if (activeRoomId && !isDMMode) {
      socket.emit("join_channel", activeRoomId);

      const handleMessage = (msg) => {
        setMessages((prev) => {
          if (msg._id && prev.some((m) => m._id === msg._id)) {
            return prev;
          }
          return [...prev, msg];
        });
      };

      socket.on("receive_message", handleMessage);

      return () => {
        socket.emit("leave_channel", activeRoomId);
        socket.off("receive_message", handleMessage);
      };
    }
  }, [isDMMode, workspaceId, activeRoomId]);
};