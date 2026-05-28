import { useState, useEffect, useRef } from "react";
import {
  fetchChannelMessages,
  getDirectMessages,
} from "../../../api/messageApi";

export const useChatMessages = ({
  activeRoomId,
  isDMMode,
  dmReceiverId,
  workspaceId,
  profile,
}) => {
  const [messages, setMessages] = useState([]);
  const dmCacheRef = useRef({});

  useEffect(() => {
    if (!activeRoomId || !profile?._id || !workspaceId) return;

    const fetchMessages = async () => {
      try {
        if (isDMMode && dmReceiverId) {
          const selfId = profile._id;

          const response = await getDirectMessages(
            workspaceId,
            selfId,
            dmReceiverId
          );

          let raw = [];

          if (Array.isArray(response?.data?.messages)) {
            raw = response.data.messages;
          } else if (Array.isArray(response?.data)) {
            raw = response.data;
          }

          dmCacheRef.current[dmReceiverId] = raw;
          setMessages(raw);
        } else {
          const response = await fetchChannelMessages(activeRoomId);

          const raw = Array.isArray(response?.data)
            ? response.data
            : response?.data?.messages || [];

          setMessages(raw);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [activeRoomId, isDMMode, dmReceiverId, workspaceId, profile?._id]);

  return { messages, setMessages, dmCacheRef };
};