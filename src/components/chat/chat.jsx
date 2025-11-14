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
import socket, { joinDMWorkspace, sendDirectMessage, onReceiveDirectMessage, offReceiveDirectMessage, onDMDeleted, offDMDeleted } from "./socket.jsx";
import { createLayout } from "../../api/layoutApi.js";
import ChatLayout from "./ChatLayout.jsx";
import { getDirectMessages } from "../../api/authApi.js";

const Chat = ({ username, roomId, remoteUserId }) => {
  const workspaceName = useSelector((state) => state.user.workspaceName);
  const profile = useSelector((state) => state.user.profile);
  const workspaceId = useSelector((state) => state.user.workspaceId);

  const [activeRoomId, setActiveRoomId] = useState(roomId || null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const [showVideoConference, setShowVideoConference] = useState(false);
  const [showTeamBuilder, setShowTeamBuilder] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDMMode, setIsDMMode] = useState(false);
  const [dmReceiverId, setDmReceiverId] = useState(null);
  const [dmReceiverName, setDmReceiverName] = useState("");
  const [unreadDMs, setUnreadDMs] = useState({});

  const layoutPostedRef = useRef(false);
  const textareaRef = useRef(null);
  const mainRef = useRef(null);
  const socketRef = useRef(socket);
  const { startCall } = useVoiceCall(SOCKET_URL);
  const dmCacheRef = useRef({}); // In-memory cache only for current session

  // Restore DM state on mount/refresh - will fetch from server via socket
  useEffect(() => {
    const savedDMState = sessionStorage.getItem('currentDM');
    if (savedDMState) {
      try {
        const { receiverId, receiverName } = JSON.parse(savedDMState);
        if (receiverId && receiverName) {
          console.log('[DM] Restoring DM session:', receiverName, receiverId);
          setIsDMMode(true);
          setDmReceiverId(receiverId);
          setDmReceiverName(receiverName);
          setActiveRoomId(`dm-${receiverId}`);
          // Ensure other views are hidden
          setShowMap(false);
          setShowTeamBuilder(false);
          setShowMeeting(false);
          setShowVideoConference(false);
          // Messages will be fetched from server via useEffect below
        }
      } catch (err) {
        console.error('[DM] Failed to restore DM state:', err);
      }
    }
  }, []);

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

  const handleStartDM = (receiverId, receiverName) => {
    // Save current DM messages to in-memory cache before switching
    if (isDMMode && dmReceiverId && messages.length > 0) {
      dmCacheRef.current[dmReceiverId] = messages;
      console.log("[DM] Cached", messages.length, "messages in memory for user", dmReceiverId);
    }
    
    setIsDMMode(true);
    setDmReceiverId(receiverId);
    setDmReceiverName(receiverName);
    setActiveRoomId(`dm-${receiverId}`);
    setShowMap(false);
    setShowTeamBuilder(false);
    setShowMeeting(false);
    setShowVideoConference(false);
    
    // Save to sessionStorage for refresh persistence
    sessionStorage.setItem('currentDM', JSON.stringify({ receiverId, receiverName }));
    
    // Mark as read
    setUnreadDMs(prev => {
      const updated = { ...prev };
      delete updated[receiverId];
      return updated;
    });
    
    // Load from cache if available (don't clear on refresh)
    if (dmCacheRef.current[receiverId] && dmCacheRef.current[receiverId].length > 0) {
      console.log("[DM] Loading", dmCacheRef.current[receiverId].length, "cached messages for", receiverName);
      setMessages(dmCacheRef.current[receiverId]);
    } else {
      console.log("[DM] No cache for", receiverName, "- keeping current messages until fetch completes");
      // Don't clear messages - let fetch handle it
    }
    
    console.log("[DM] Starting DM with:", receiverName, receiverId);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      if (isDMMode) {
        // Delete DM
        const { deleteDirectMessage } = await import("../../api/authApi.js");
        await deleteDirectMessage(messageId);
        console.log("[DM] Deleted message:", messageId);
      } else {
        // Delete channel message (if API exists)
        console.log("[Channel] Delete message:", messageId);
      }
      
      // Remove from local state
      setMessages(prev => {
        const updated = prev.filter(m => m._id !== messageId);
        // Update in-memory cache if in DM mode
        if (isDMMode && dmReceiverId) {
          dmCacheRef.current[dmReceiverId] = updated;
        }
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete message:", err);
      alert("Failed to delete message");
    }
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

  // --- Combined: Fetch messages and setup socket listeners ---
  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;

    // Fetch messages on mount/change
    const fetchMessages = async () => {
      if (!activeRoomId) return setMessages([]);
      try {
        if (isDMMode && dmReceiverId) {
          // Fetch direct messages from server
          const selfId = profile?._id;
          if (!selfId || !workspaceId) {
            console.warn("[DM] Missing selfId or workspaceId, selfId:", selfId, "workspaceId:", workspaceId);
            return;
          }
          
          console.log("[DM] ========== FETCHING MESSAGES ==========");
          console.log("[DM] Params - workspaceId:", workspaceId, "selfId:", selfId, "receiverId:", dmReceiverId);
          console.log("[DM] API URL will be: /dm/" + workspaceId + "/" + selfId + "/" + dmReceiverId);
          
          try {
            const response = await getDirectMessages(workspaceId, selfId, dmReceiverId);
            console.log("[DM] Raw API Response:", response);
            console.log("[DM] Response data:", response?.data);
            
            // Check response structure
            console.log("[DM] response.data type:", typeof response?.data);
            console.log("[DM] response.data.messages:", response?.data?.messages);
            console.log("[DM] Is response.data.messages an array?", Array.isArray(response?.data?.messages));
            
            let raw = [];
            if (response?.data?.messages && Array.isArray(response.data.messages)) {
              raw = response.data.messages;
            } else if (response?.data && Array.isArray(response.data)) {
              raw = response.data;
            } else {
              console.warn("[DM] Unexpected response structure:", response?.data);
            }
            
            console.log("[DM] Parsed messages array length:", raw.length);
            
            // Update in-memory cache and set messages
            if (raw.length > 0) {
              dmCacheRef.current[dmReceiverId] = raw;
              setMessages(raw);
              console.log("[DM] ✅ Successfully loaded from server:", raw.length, "messages");
              console.log("[DM] First message:", raw[0]);
              console.log("[DM] Last message:", raw[raw.length - 1]);
            } else {
              console.warn("[DM] ⚠️ No messages returned from server");
              setMessages([]);
            }
            
            console.log("[DM] View state - isDMMode:", isDMMode, "showMap:", showMap, "showTeamBuilder:", showTeamBuilder, "showMeeting:", showMeeting, "showVideoConference:", showVideoConference);
            console.log("[DM] ========================================");
          } catch (error) {
            console.error("[DM] Failed to fetch messages:", error);
            // Keep existing messages on error
          }
        } else if (activeRoomId && !isDMMode) {
          // Fetch channel messages
          const response = await fetchChannelMessages(activeRoomId);
          const raw = Array.isArray(response?.data)
            ? response.data
            : response?.data?.messages;
          setMessages(raw || []);
          console.log("[Channel] Loaded", (raw || []).length, "messages");
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        // Don't clear messages on error if we have cache
        if (!(isDMMode && dmCacheRef.current[dmReceiverId])) {
          setMessages([]);
        }
      }
    };

    // Only fetch if we have the necessary data
    if (activeRoomId && profile?._id && workspaceId) {
      fetchMessages();
    }

    // Setup socket listeners
    if (isDMMode && workspaceId) {
      // Join workspace for DM
      joinDMWorkspace(workspaceId);
      
      const onReceiveDM = (msg) => {
        console.log("[DM] receive_dm:", msg);
        
        const senderId = msg.sender?._id || msg.sender;
        const receiverId = msg.receiver?._id || msg.receiver;
        const otherUserId = senderId === profile?._id ? receiverId : senderId;
        
        setMessages((prev) => {
          // Check for duplicates by _id
          if (prev.some((m) => m._id === msg._id)) {
            console.log("[DM] skipped duplicate:", msg._id);
            return prev;
          }
          
          // Replace temp message - match by sender, content and recent timestamp (within 5 seconds)
          const now = new Date(msg.createdAt).getTime();
          const tempIndex = prev.findIndex(
            (m) => {
              if (!m.tempId || m._id) return false;
              const isSameSender = m.sender?._id === msg.sender?._id;
              const isSameContent = m.content?.trim() === msg.content?.trim();
              const tempTime = new Date(m.createdAt).getTime();
              const isRecent = Math.abs(now - tempTime) < 5000; // within 5 seconds
              return isSameSender && isSameContent && isRecent;
            }
          );
          
          if (tempIndex !== -1) {
            console.log("[DM] Replacing temp message at index", tempIndex);
            const updated = [...prev];
            updated[tempIndex] = msg;
            // Update in-memory cache
            if (otherUserId) {
              dmCacheRef.current[otherUserId] = updated;
            }
            return updated;
          }
          
          // Add new message
          const updated = [...prev, msg];
          
          // Update in-memory cache
          if (otherUserId) {
            dmCacheRef.current[otherUserId] = updated;
          }
          
          // Track unread if not in active DM
          if (senderId !== profile?._id && dmReceiverId !== senderId) {
            setUnreadDMs(prev => ({
              ...prev,
              [senderId]: (prev[senderId] || 0) + 1
            }));
          }
          
          setTimeout(() => {
            mainRef.current?.scrollTo({
              top: mainRef.current.scrollHeight,
              behavior: "smooth",
            });
          }, 100);
          return updated;
        });
      };

      onReceiveDirectMessage(onReceiveDM);
      
      // Listen for deleted messages
      const onDMDeletedHandler = (data) => {
        console.log("[DM] Message deleted:", data.messageId);
        setMessages(prev => {
          const updated = prev.filter(m => m._id !== data.messageId);
          if (dmReceiverId) {
            dmCacheRef.current[dmReceiverId] = updated;
          }
          return updated;
        });
      };
      
      onDMDeleted(onDMDeletedHandler);
      
      return () => {
        offReceiveDirectMessage();
        offDMDeleted();
      };
    } else if (activeRoomId) {
      // Regular channel mode
      s.emit("join_channel", activeRoomId);
      console.log("[socket] joined_channel:", activeRoomId);

      const onReceiveMessage = (msg) => {
        console.log("[socket] receive_message:", msg);

        setMessages((prev) => {
          // Check for duplicates by _id
          if (prev.some((m) => m._id === msg._id)) {
            console.log("[socket] skipped duplicate message:", msg._id);
            return prev;
          }

          // Replace temp message - match by sender, content and recent timestamp
          const now = new Date(msg.createdAt).getTime();
          const tempIndex = prev.findIndex(
            (m) => {
              if (!m.tempId || m._id) return false;
              const isSameSender = m.sender?._id === msg.sender?._id;
              const isSameContent = m.content?.trim() === msg.content?.trim();
              const tempTime = new Date(m.createdAt).getTime();
              const isRecent = Math.abs(now - tempTime) < 5000;
              return isSameSender && isSameContent && isRecent;
            }
          );

          if (tempIndex !== -1) {
            console.log("[Channel] Replacing temp message at index", tempIndex);
            const updated = [...prev];
            updated[tempIndex] = msg; 
            return updated;
          }

          // Add new message
          const updated = [...prev, msg];
          setTimeout(() => {
            mainRef.current?.scrollTo({
              top: mainRef.current.scrollHeight,
              behavior: "smooth",
            });
          }, 100);
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
    }
  }, [activeRoomId, isDMMode, dmReceiverId, workspaceId, profile]);

  // --- Send message ---
const sendMessage = async () => {
  if (messageInput.trim() === "" && attachments.length === 0) return;

  const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const selfId = profile?._id;

  if (isDMMode && dmReceiverId) {
    // Send DM - Add optimistic message
    const dmPayload = {
      receiverId: dmReceiverId,
      workspaceId,
      content: messageInput,
      attachments,
    };

    const optimisticMessage = {
      tempId,
      content: messageInput,
      attachments,
      sender: {
        _id: selfId,
        username: profile?.username,
        avatar: profile?.avatar || "/default-avatar.png",
      },
      receiver: {
        _id: dmReceiverId,
      },
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    sendDirectMessage(dmPayload);
    console.log("[DM] Sent message, tempId:", tempId);
  } else {
    // Send channel message - Add optimistic message
    const optimisticMessage = {
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

    setMessages((prev) => [...prev, optimisticMessage]);
    socketRef.current.emit("send_message", optimisticMessage);
    console.log("[Channel] Sent message, tempId:", tempId);
  }

  setMessageInput("");
  setAttachments([]);
  
  // Scroll to bottom
  setTimeout(() => {
    mainRef.current?.scrollTo({
      top: mainRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, 50);
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
          onChannelSelect={(channelId) => {
            // Save current DM messages to in-memory cache before switching
            if (isDMMode && dmReceiverId && messages.length > 0) {
              dmCacheRef.current[dmReceiverId] = messages;
              console.log("[DM] Cached messages in memory before switching to channel");
            }
            setActiveRoomId(channelId);
            setIsDMMode(false);
            setDmReceiverId(null);
            setDmReceiverName("");
            sessionStorage.removeItem('currentDM');
          }}
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
          onStartDM={handleStartDM}
          unreadDMs={unreadDMs}
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
              : isDMMode
              ? `Direct Message - ${dmReceiverName}`
              : workspaceName || "Workspace"
          }
          onCallClick={handleCallClick}
        />

        <div className="flex-1 relative overflow-hidden">
        { showVideoConference ? (
          <VideoConference />
        ): !showMap && ! showTeamBuilder && ! showMeeting ? (
            <div className="flex flex-col h-full min-h-0">
              <div className="relative flex-1 overflow-y-auto space-y-4 scrollbar-hide min-h-0">
                <InfoBar
                  onSearchChange={setSearchQuery}
                  channelName={activeRoomId || "Channel"}
                  memberCount={0}
                  onlineCount={0}
                />
                <MessageList messages={displayedMessages} username={username} onDeleteMessage={handleDeleteMessage} />
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
          ): null }
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

