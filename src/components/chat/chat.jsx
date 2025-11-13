import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import MessageList from "../chat/message.jsx";
import Sidebar from "../chat/sidebar.jsx";
import {
  sendMessageToChannel,
  fetchChannelMessages,
  getWorkspaceForUsers,
} from "../../api/authApi.js";
import InputBox from "../chat/input.jsx";
import Header from "../chat/header.jsx";
import InfoBar from "../chat/infobar.jsx";
import TeamBuilder from "../chat/teambuilder.jsx";
import Map from "../map/Map.jsx";
import ManagerMeeting from "../dashboard/Meeting/ManagerMeeting.jsx";
import VideoConference from "./VideoConference.jsx";
import { useVoiceCall } from "../voice/useVoiceCall.js";
import { SOCKET_URL } from "../../config.js";
import socket from "./socket.jsx";
import { createLayout } from "../../api/layoutApi.js";
import ChatLayout from "./ChatLayout.jsx";

const Chat = ({ username, roomId, remoteUserId }) => {
  const workspaceName = useSelector((state) => state.user.workspaceName);
  const profile = useSelector((state) => state.user.profile);

  const [activeRoomId, setActiveRoomId] = useState(roomId || null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const [showVideoConference, setShowVideoConference] = useState(false);
  const [showTeamBuilder, setShowTeamBuilder] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const layoutPostedRef = useRef(false);
  const textareaRef = useRef(null);
  const mainRef = useRef(null);
  const socketRef = useRef(socket);
  const { startCall } = useVoiceCall(SOCKET_URL);

  // --- Emoji handling ---
  const handleEmojiSelect = useCallback(
    (emoji) => setMessageInput((prev) => prev + emoji),
    []
  );

  // --- Sidebar click handlers ---
  const handleCreateTeamClick = () => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    setShowTeamBuilder(true);
    setShowMap(false);
    setShowMeeting(false);
    setShowVideoConference(false);
  };
  const handleCreateMeetingClick = () => {
    setShowMeeting(true);
    setShowMap(false);
    setShowTeamBuilder(false);
    setShowVideoConference(false);
  };
  const handleVirtualSpaceClick = () => {
    setShowMap(true);
    setShowTeamBuilder(false);
    setShowMeeting(false);
    setShowVideoConference(false);
  };
  const handleVideoConferenceClick = () => {
    setShowVideoConference(true);
    setShowMap(false);
    setShowTeamBuilder(false);
    setShowMeeting(false);
  };

  const handleCallClick = () => {
    if (remoteUserId) startCall(remoteUserId);
    else console.warn("No remote user ID provided for call.");
  };

  // --- Auto-resize textarea ---
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [messageInput]);

  // --- Fetch messages when room changes ---
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeRoomId) return setMessages([]);
      try {
        const response = await fetchChannelMessages(activeRoomId);
        const raw = Array.isArray(response?.data)
          ? response.data
          : response?.data?.messages;
        setMessages(raw || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [activeRoomId]);

  // --- SOCKET HANDLING ---
  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;

    if (activeRoomId) {
      s.emit("join_channel", activeRoomId);
      console.log("[socket] joined_channel:", activeRoomId);
    }

    const onReceiveMessage = (msg) => {
      console.log("[socket] receive_message:", msg);

      setMessages((prev) => {
        // --- Check for duplicates (tempId or _id)
        if (prev.some((m) => m._id === msg._id || m.tempId === msg._id)) {
          console.log("[socket] skipped duplicate message:", msg._id);
          return prev;
        }

        // --- Replace temp message if found
        const tempIndex = prev.findIndex(
          (m) =>
            m.tempId &&
            m.content === msg.content &&
            m.sender?._id === msg.sender?._id
        );

        if (tempIndex !== -1) {
          const updated = [...prev];
          updated[tempIndex] = msg; // replace temp with server message
          return updated;
        }

        // --- Otherwise, add new message
        const updated = [...prev, msg];
        mainRef.current?.scrollTo({
          top: mainRef.current.scrollHeight,
          behavior: "smooth",
        });
        console.log("[socket] updated messages:", updated.length);
        return updated;
      });
    };

    s.on("receive_message", onReceiveMessage);

    return () => {
      if (activeRoomId) {
        s.emit("leave_channel", activeRoomId);
        console.log("[socket] leave_channel:", activeRoomId);
      }
      s.off("receive_message", onReceiveMessage);
    };
  }, [activeRoomId]);

  // --- Send message ---
  const sendMessage = async () => {
    if (messageInput.trim() === "" && attachments.length === 0) return;

    const tempId = Math.random().toString(36).substring(2, 9);
    const selfId = profile?._id;
    const message = {
      tempId,
      channelId: activeRoomId,
      content: messageInput,
      attachments,
      sender: {
        _id: selfId,
        username: profile?.username,
        avatar: profile?.avatar || "/default-avatar.png",
      },
      createdAt: new Date().toISOString(),
    };

    // --- Optimistic update
    setMessages((prev) => [...prev, message]);
    socketRef.current.emit("send_message", message);

    try {
      await sendMessageToChannel(activeRoomId, message.content, message.attachments);
    } catch (err) {
      console.error("Failed to save message:", err);
    }

    setMessageInput("");
    setAttachments([]);
  };

  // --- Filter messages by search ---
  const displayedMessages = searchQuery.trim()
    ? messages.filter((m) => {
        const q = searchQuery.toLowerCase();
        const content = (m.content || "").toLowerCase();
        const senderName =
          typeof m.sender === "string"
            ? m.sender.toLowerCase()
            : (m.sender?.username || "").toLowerCase();
        return content.includes(q) || senderName.includes(q);
      })
    : messages;

  return (
    <ChatLayout
      sidebar={
        <Sidebar
          onChannelSelect={setActiveRoomId}
          onCreateTeam={handleCreateTeamClick}
          onCreateMeeting={handleCreateMeetingClick}
          onVirtualSpaceClick={handleVirtualSpaceClick}
          onVideoConferenceClick={handleVideoConferenceClick}
          onChatClick={() => {
            setShowMap(false);
            setShowTeamBuilder(false);
            setShowMeeting(false);
            setShowVideoConference(false);
          }}
        />
      }
    >
      <main ref={mainRef} className="flex-1 flex flex-col relative overflow-y-auto">
        <Header
          title={
            showVideoConference
              ? "Video Conference"
              : showMap
              ? "Virtual Space"
              : showMeeting
              ? "Meeting"
              : showTeamBuilder
              ? "Team Builder"
              : workspaceName || "Workspace"
          }
          onCallClick={handleCallClick}
        />

        <div className="flex-1 relative overflow-hidden">
          {!showMap && !showTeamBuilder && !showMeeting && !showVideoConference && (
            <div className="flex flex-col h-full min-h-0">
              <div className="relative flex-1 overflow-y-auto space-y-4 scrollbar-hide min-h-0">
                <InfoBar
                  onSearchChange={setSearchQuery}
                  channelName={activeRoomId || "Channel"}
                  memberCount={0}
                  onlineCount={0}
                />
                <MessageList messages={displayedMessages} username={username} />
              </div>
              <InputBox
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                sendMessage={sendMessage}
                mainRef={mainRef}
                textareaRef={textareaRef}
                handleEmojiSelect={handleEmojiSelect}
                attachments={attachments}
                setAttachments={setAttachments}
              />
            </div>
          )}
          <style>{`
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            .scrollbar-hide::-webkit-scrollbar { display: none; }
          `}</style>
        </div>
      </main>
    </ChatLayout>
  );
};

export default Chat;

