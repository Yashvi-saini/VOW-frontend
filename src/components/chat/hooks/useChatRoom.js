import { useEffect, useRef, useState } from "react";
import { fetchChannelMessages, sendMessageToChannel } from "../../../api/authApi";
import socket from "../socket.jsx";

// Encapsulates message history, socket join/leave, and sending
export default function useChatRoom(activeRoomId, profile, opts = {}) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(socket);

  // Load history when room changes
  useEffect(() => {
    const load = async () => {
      if (!activeRoomId) { setMessages([]); return; }
      try {
        const res = await fetchChannelMessages(activeRoomId);
        const raw = Array.isArray(res?.data) ? res.data : res?.data?.messages;
        setMessages(raw || []);
      } catch (e) {
        console.warn('[chat] fetch messages failed', e?.response?.data || e?.message || e);
      }
    };
    load();
  }, [activeRoomId]);

  // Socket join/leave and live updates
  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;
    const onMessage = (message) => setMessages(prev => [...prev, message]);
    if (activeRoomId) s.emit('joinRoom', activeRoomId);
    s.on('message', onMessage);
    return () => {
      if (activeRoomId) s.emit('leaveRoom', activeRoomId);
      s.off('message', onMessage);
    };
  }, [activeRoomId]);

  const send = async (channelId, text, attachments = []) => {
    if (!channelId || (!text?.trim() && (!attachments || attachments.length === 0))) return;
    const message = {
      channelId,
      content: text,
      attachments,
      sender: {
        _id: profile?._id,
        username: profile?.username,
        avatar: profile?.avatar || "/default-avatar.png",
      },
      createdAt: new Date().toISOString(),
    };
    try {
      socketRef.current.emit('message', message);
      await sendMessageToChannel(channelId, message.content, message.attachments);
    } catch (e) {
      console.error('[chat] send failed', e);
    }
  };

  return { messages, setMessages, send };
}
