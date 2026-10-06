import { useEffect } from "react";
import socket, {
  connectSocket,
  joinDMWorkspace,
} from "../socket";

export const useChatSocket = ({
  isDMMode,
  dmReceiverId,
  workspaceId,
  activeRoomId,
  userId,
  setMessages,
  setUnreadDMs,
}) => {
  useEffect(() => {
    if (!socket) return;
    connectSocket();

    const isDM =
      isDMMode ||
      (typeof activeRoomId === "string" && activeRoomId.startsWith("dm-"));

    const effectiveUserId = userId || localStorage.getItem("userId");

    const handleMessage = (msg) => {
      if (!msg || isDM) return;
      const msgChannelId = typeof msg.channelId === "object" ? (msg.channelId._id || msg.channelId.id) : msg.channelId;
      if (activeRoomId && String(msgChannelId) === String(activeRoomId)) {
        setMessages((prev) => {
          if (msg._id && prev.some((m) => String(m._id) === String(msg._id))) {
            return prev;
          }
          const optIdx = prev.findIndex(
            (m) => m.isOptimistic && (m._id === msg.tempId || m.content === msg.content)
          );
          if (optIdx !== -1) {
            const next = [...prev];
            next[optIdx] = msg;
            return next;
          }
          return [...prev, msg];
        });
      }
    };

    const handleDM = (msg) => {
      if (!msg) return;

      const senderId = typeof msg.sender === "object" ? (msg.sender._id || msg.sender.id) : msg.sender;
      const receiverId = typeof msg.receiver === "object" ? (msg.receiver._id || msg.receiver.id) : msg.receiver;

      let currentTargetDmId = dmReceiverId;
      if (!currentTargetDmId && typeof activeRoomId === "string" && activeRoomId.startsWith("dm-")) {
        currentTargetDmId = activeRoomId.replace("dm-", "");
      }

      const isCurrentDMChat = isDM && currentTargetDmId && (String(senderId) === String(currentTargetDmId) || String(receiverId) === String(currentTargetDmId));

      if (isCurrentDMChat) {
        setMessages((prev) => {
          if (msg._id && prev.some((m) => String(m._id) === String(msg._id))) {
            return prev;
          }
          const optIdx = prev.findIndex(
            (m) => m.isOptimistic && (m._id === msg.tempId || m.content === msg.content)
          );
          if (optIdx !== -1) {
            const next = [...prev];
            next[optIdx] = msg;
            return next;
          }
          return [...prev, msg];
        });
      } else {
        if (senderId && String(senderId) !== String(effectiveUserId) && setUnreadDMs) {
          setUnreadDMs((prev) => ({
            ...prev,
            [senderId]: (prev[senderId] || 0) + 1,
          }));
        }
      }
    };

    const handleReactionUpdated = (data) => {
      if (!data || !data.messageId) return;
      setMessages((prev) =>
        prev.map((m) =>
          String(m._id) === String(data.messageId)
            ? { ...m, reactions: data.reactions }
            : m
        )
      );
    };

    socket.on("receive_message", handleMessage);
    socket.on("receive_dm", handleDM);
    socket.on("message_reaction_updated", handleReactionUpdated);
    socket.on("dm_reaction_updated", handleReactionUpdated);

    const joinCurrentRooms = () => {
      if (workspaceId) {
        joinDMWorkspace(workspaceId);
      }
      if (activeRoomId && !isDM) {
        socket.emit("join_channel", activeRoomId);
      }
    };

    joinCurrentRooms();
    socket.on("connect", joinCurrentRooms);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("receive_dm", handleDM);
      socket.off("message_reaction_updated", handleReactionUpdated);
      socket.off("dm_reaction_updated", handleReactionUpdated);
      socket.off("connect", joinCurrentRooms);
      if (activeRoomId && !isDM) {
        socket.emit("leave_channel", activeRoomId);
      }
    };
  }, [isDMMode, dmReceiverId, workspaceId, activeRoomId, userId, setMessages, setUnreadDMs]);
};