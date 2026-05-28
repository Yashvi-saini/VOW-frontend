import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

import MessageList from "../chat/message.jsx";
import Sidebar from "../chat/sidebar.jsx";
import CreateTeamModal from "./CreateTeamModal.jsx";
import MemberMultiSelect from "./MemberMultiSelect.jsx";

import InputBox from "../chat/input.jsx";
import Header from "../chat/header.jsx";
import InfoBar from "../chat/infobar.jsx";
import TeamBuilder from "../chat/teambuilder.jsx";
import Map from "../map/Map.jsx";
import ManagerMeeting from "../dashboard/Meeting/ManagerMeeting.jsx";
import VideoConference from "./VideoConference.jsx";

import { useVoiceCall } from "../voice/useVoiceCall.js";
import { useMembers } from "../useMembers.js";

import socket, { sendDirectMessage } from "./socket.jsx";
import ChatLayout from "./ChatLayout.jsx";

// ✅ NEW HOOKS
import { useChatTeams } from "./hooks/useChatTeams";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatSocket } from "./hooks/useChatSocket";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const Chat = ({ username, roomId, remoteUserId }) => {
  const workspaceName = useSelector((state) => state.user.workspaceName);
  const profile = useSelector((state) => state.user.profile);
  const workspaceId = useSelector((state) => state.user.workspaceId);
  const { members } = useMembers(workspaceId);

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(roomId || null);
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState([]);

  const [showMap, setShowMap] = useState(true);
  const [showMeeting, setShowMeeting] = useState(false);
  const [showVideoConference, setShowVideoConference] = useState(false);
  const [showTeamBuilder, setShowTeamBuilder] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [isDMMode, setIsDMMode] = useState(false);
  const [dmReceiverId, setDmReceiverId] = useState(null);
  const [dmReceiverName, setDmReceiverName] = useState("");
  const [unreadDMs, setUnreadDMs] = useState({});
  const [actionType, setActionType] = useState(null);

  const textareaRef = useRef(null);
  const mainRef = useRef(null);
  const { startCall } = useVoiceCall(SOCKET_URL);

  // ✅ HOOKS
  const { teams } = useChatTeams(workspaceId);

  const { messages, setMessages, dmCacheRef } = useChatMessages({
    activeRoomId,
    isDMMode,
    dmReceiverId,
    workspaceId,
    profile,
  });

  useChatSocket({
    isDMMode,
    workspaceId,
    activeRoomId,
    setMessages,
  });

  // Restore DM session
  useEffect(() => {
    const savedDMState = sessionStorage.getItem("currentDM");
    if (!savedDMState) return;

    try {
      const { receiverId, receiverName } = JSON.parse(savedDMState);

      if (receiverId && receiverName) {
        setIsDMMode(true);
        setDmReceiverId(receiverId);
        setDmReceiverName(receiverName);
        setActiveRoomId(`dm-${receiverId}`);
        setShowMap(false);
      }
    } catch (err) {
      console.error("Failed to restore DM state:", err);
    }
  }, []);

  // Auto resize
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      160
    )}px`;
  }, [messageInput]);

  const handleEmojiSelect = useCallback(
    (emoji) => setMessageInput((prev) => prev + emoji),
    []
  );

  const handleStartDM = (receiverId, receiverName) => {
    if (isDMMode && dmReceiverId && messages.length > 0) {
      dmCacheRef.current[dmReceiverId] = messages;
    }

    setIsDMMode(true);
    setDmReceiverId(receiverId);
    setDmReceiverName(receiverName);
    setActiveRoomId(`dm-${receiverId}`);

    sessionStorage.setItem(
      "currentDM",
      JSON.stringify({ receiverId, receiverName })
    );

    setMessages(dmCacheRef.current[receiverId] || []);
  };

  const sendMessage = async () => {
    if (!messageInput.trim() && attachments.length === 0) return;

    const tempId = Date.now();

    if (isDMMode && dmReceiverId) {
      setMessages((prev) => [
        ...prev,
        { tempId, content: messageInput },
      ]);

      sendDirectMessage({
        receiverId: dmReceiverId,
        workspaceId,
        content: messageInput,
        attachments,
      });
    } else {
      socket.emit("send_message", {
        channelId: activeRoomId,
        content: messageInput,
      });
    }

    setMessageInput("");
    setAttachments([]);
  };

  const displayedMessages = searchQuery
    ? messages.filter((m) =>
        m.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <ChatLayout
      sidebar={
        <Sidebar
          onChannelSelect={(id) => {
            setActiveRoomId(id);
            setIsDMMode(false);
          }}
          onStartDM={handleStartDM}
          unreadDMs={unreadDMs}
        />
      }
    >
      <Header title={workspaceName} onCallClick={() => startCall(remoteUserId)} />

      <MessageList
        messages={displayedMessages}
        username={username}
      />

      <InputBox
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        sendMessage={sendMessage}
        textareaRef={textareaRef}
        handleEmojiSelect={handleEmojiSelect}
        attachments={attachments}
        setAttachments={setAttachments}
        members={members}
      />
    </ChatLayout>
  );
};

export default Chat;