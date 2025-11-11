import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import MessageList from "../chat/message.jsx";
import Sidebar from "../chat/sidebar.jsx";
import { sendMessageToChannel, fetchChannelMessages, getWorkspaceForUsers } from "../../api/authApi.js";
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

  const handleEmojiSelect = useCallback(
    (selectedEmoji) => setMessageInput((prev) => prev + selectedEmoji),
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [messageInput]);

  // --- Fetch messages when room changes ---
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeRoomId) return setMessages([]);
      try {
        const response = await fetchChannelMessages(activeRoomId);
        const raw = Array.isArray(response?.data) ? response.data : response?.data?.messages;
        setMessages(raw || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [activeRoomId]);

  // --- Socket connection & room handling ---
  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;

    if (activeRoomId) s.emit("joinRoom", activeRoomId);

    const onMessage = (msg) => setMessages((prev) => [...prev, msg]);
    s.on("message", onMessage);

    return () => {
      if (activeRoomId) s.emit("leaveRoom", activeRoomId);
      s.off("message", onMessage);
    };
  }, [activeRoomId]);

  // --- Create layout when map is shown ---
  useEffect(() => {
    if (!showMap || layoutPostedRef.current) return;

    const id = requestAnimationFrame(() => {
      try {
        let rooms = [];
        if (typeof window !== "undefined" && typeof window.getMapRooms === "function") {
          rooms = window.getMapRooms(true);
        } else {
          const nodes = document.querySelectorAll("[data-room-id]");
          rooms = Array.from(nodes).map((n) => n.getAttribute("data-room-id")).filter(Boolean);
        }

        const payload = {
          name: "Office Layout - Ground Floor",
          layoutUrl: "https://w7.pngwing.com/pngs/279/877/png-transparent-hyperlink-computer-icons-link-text-logo-number-thumbnail.png",
          rooms,
          metadata: { floor: 1 },
        };

        createLayout(payload)
          .then((res) => {
            console.log("[layout] created/updated", res?.data);
            layoutPostedRef.current = true;
            window.dispatchEvent(new CustomEvent("toast", { detail: { type: "success", message: "Layout saved" } }));
          })
          .catch((err) => {
            const msg = err?.response?.data || err?.message || err;
            console.error("[layout] failed", msg);
            window.dispatchEvent(new CustomEvent("toast", { detail: { type: "error", message: "Layout save failed" } }));
          });
      } catch (e) {
        console.error("[layout] unexpected error while preparing payload", e);
      }
    });

    return () => cancelAnimationFrame(id);
  }, [showMap]);

  // --- Room ID sync ---
  useEffect(() => {
    if (roomId !== activeRoomId) setActiveRoomId(roomId);
  }, [roomId]);

  // --- Send message ---
  const sendMessage = async () => {
    if (messageInput.trim() === "" && attachments.length === 0) return;

    const selfId = profile?._id || profile?.id || null;
    let peerId = remoteUserId || null;
    if (!peerId && typeof activeRoomId === "string" && selfId && activeRoomId.includes("-")) {
      const parts = activeRoomId.split("-");
      peerId = parts.find((p) => p && p !== String(selfId)) || null;
    }

    try {
      if (selfId && peerId) await getWorkspaceForUsers(selfId, peerId);
    } catch (e) {
      console.warn("/workspace/{user1}/{user2} call failed", e?.response?.data || e?.message || e);
    }

    const message = {
      channelId: activeRoomId,
      content: messageInput,
      attachments,
      sender: { _id: profile?._id, username: profile?.username, avatar: profile?.avatar || "/default-avatar.png" },
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]);
    socketRef.current.emit("message", message);

    try {
      if (activeRoomId) await sendMessageToChannel(activeRoomId, message.content, message.attachments);
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
        const senderName = typeof m.sender === "string" ? m.sender.toLowerCase() : (m.sender?.username || "").toLowerCase();
        return content.includes(q) || senderName.includes(q);
      })
    : messages;

  // --- Render ---
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
            setShowMap(false); setShowTeamBuilder(false); setShowMeeting(false); setShowVideoConference(false);
          }}
        />
      }
    >
      <main ref={mainRef} className="flex-1 flex flex-col relative">
        <Header
          title={
            showVideoConference ? "Video Conference" :
            showMap ? "Virtual Space" :
            showMeeting ? "Meeting" :
            showTeamBuilder ? "Team Builder" :
            workspaceName || "Workspace"
          }
          onCallClick={handleCallClick}
        />

        <div className="flex-1 relative overflow-hidden">
          {showMap && <div className="absolute inset-0 overflow-auto scrollbar-hide"><Map /></div>}
          {showMeeting && !showMap && <div className="absolute inset-0 overflow-y-auto px-8 py-6 bg-[#F3F3F6]"><ManagerMeeting /></div>}
          {showVideoConference && !showMap && !showMeeting && <div className="absolute inset-0"><VideoConference /></div>}
          {showTeamBuilder && !showMap && !showMeeting && !showVideoConference && <div className="absolute inset-0 overflow-y-auto px-4 py-2"><TeamBuilder /></div>}

          {!showMap && !showTeamBuilder && !showMeeting && !showVideoConference && (
            <div className="flex flex-col h-full min-h-0">
              <div className="relative flex-1 overflow-y-auto space-y-4 scrollbar-hide min-h-0">
                <InfoBar onSearchChange={setSearchQuery} channelName={activeRoomId || 'Channel'} memberCount={0} onlineCount={0} />
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
