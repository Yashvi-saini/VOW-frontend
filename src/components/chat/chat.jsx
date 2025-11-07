import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import user from "../../assets/icon.svg";
import MessageList from "../chat/message.jsx";
import Sidebar from "../chat/sidebar.jsx";
import { sendMessageToChannel } from "../../api/authApi.js";
import { fetchChannelMessages } from "../../api/authApi.js";
import InputBox from "../chat/input.jsx";
import Header from "../chat/header.jsx";
import InfoBar from "../chat/infobar.jsx";
import TeamBuilder from "../chat/teambuilder.jsx";
import Map from "../map/Map.jsx";
import ManagerMeeting from "../dashboard/Meeting/ManagerMeeting.jsx";
import { useVoiceCall } from "../voice/useVoiceCall.js";

const Chat = ({ username, roomId, remoteUserId }) => {
  const workspaceName = useSelector((state) => state.user.workspaceName);
  const [activeRoomId, setActiveRoomId] = useState(roomId || null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const socketRef = useRef(null);
  const textareaRef = useRef(null);
  const mainRef = useRef(null);
  const handleEmojiSelect = useCallback(
    (selectedEmoji) => setMessageInput((prev) => prev + selectedEmoji),
    []
  );
const [showTeamBuilder, setShowTeamBuilder] = useState(false);
 const { startCall } = useVoiceCall("http://localhost:8001");

  const handleCreateTeamClick = () => {
    setShowTeamBuilder(true);
    setShowMap(false);
    setShowMeeting(false);
  };

  const handleCreateMeetingClick = () => {
    setShowMeeting(true);
    setShowMap(false);
    setShowTeamBuilder(false);
  };

  const handleVirtualSpaceClick = () => {
    setShowMap(true);
    setShowTeamBuilder(false);
    setShowMeeting(false);
  };

  useEffect(() => {
    if (roomId !== activeRoomId) {
      setActiveRoomId(roomId);
    }
  }, [roomId]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [messageInput]);

   const handleCallClick = () => {
    if (remoteUserId) {
      startCall(remoteUserId);
    } else {
      console.warn("No remote user ID provided for call.");
    }
  };


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("Fetching for room:", activeRoomId);
        const response = await fetchChannelMessages(activeRoomId);
        console.log("Fetched messages:", response.data.messages);
        setMessages(response.data || []);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    if (activeRoomId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [activeRoomId]);

  useEffect(() => {
    socketRef.current = io("http://localhost:8001", {
      transports: ["websocket", "polling"],
    });

    if (activeRoomId) {
      socketRef.current.emit("joinRoom", activeRoomId);
    }

    socketRef.current.on("connect", () => {
      console.log("connected", socketRef.current.id);
    });

    socketRef.current.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("disconnected", reason);
    });

    return () => {
      if (activeRoomId) {
        socketRef.current.emit("leaveRoom", activeRoomId);
      }
      socketRef.current.off("message");
      socketRef.current.disconnect();
    };
  }, [activeRoomId]);

  const sendMessage = async () => {
    if (messageInput.trim() === "" && attachments.length === 0) return;

    const message = {
      channelId: activeRoomId,
      content: messageInput,
      attachments: attachments,
      sender: {
        _id: user._id,
        username: user.name,
        avatar: user.avatar,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      socketRef.current.emit("message", message);

      if (activeRoomId) {
        await sendMessageToChannel(
          activeRoomId,
          message.content,
          message.attachments
        );
      } else {
        console.warn(
          "No active channel selected. Message will not be saved to server."
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }

    setMessageInput("");
    setAttachments([]);
  };

  return (
    <div className="flex h-screen bg-[#F3F3F6] text-[#0E1219]">
      <Sidebar
        onChannelSelect={setActiveRoomId}
        onCreateTeam={handleCreateTeamClick}
        onCreateMeeting={handleCreateMeetingClick}
        onVirtualSpaceClick={handleVirtualSpaceClick}
        onChatClick={() => { setShowMap(false); setShowTeamBuilder(false); setShowMeeting(false); }}
      />
      <main ref={mainRef} className="flex-1 flex flex-col relative">
        {/* Fixed Header - Always Shows Workspace Name */}
        <Header title={workspaceName || "Workspace"} onCallClick={handleCallClick} />
        
        {/* Content Area - Changes Based on Sidebar Selection */}
        <div className="flex-1 relative overflow-hidden">
          {showMap && (
            <div className="absolute inset-0 overflow-auto scrollbar-hide">
              <Map />
            </div>
          )}
          {showMeeting && !showMap && (
            <div className="absolute inset-0 overflow-y-auto px-8 py-6 bg-[#F3F3F6]">
              <ManagerMeeting />
            </div>
          )}
          {showTeamBuilder && !showMap && !showMeeting && (
            <div className="absolute inset-0 overflow-y-auto px-4 py-2">
              <TeamBuilder />
            </div>
          )}
          {!showMap && !showTeamBuilder && !showMeeting && (
            <div className="flex flex-col h-full">
              <div className="relative flex-1 overflow-y-auto space-y-4 scrollbar-hide">
                <InfoBar />
                <MessageList messages={messages} username={username} />
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
    </div>
  );
};

export default Chat;
