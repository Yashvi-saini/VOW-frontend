import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import MessageList from "../chat/message.jsx";
import Sidebar from "../chat/sidebar.jsx";
import CreateTeamModal from "./CreateTeamModal.jsx";
import MemberMultiSelect from "./MemberMultiSelect.jsx";

import {
  sendMessageToChannel,
  fetchChannelMessages,
  getWorkspaceForUsers,
  getTeams,
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
import { useMembers } from "../useMembers.js";

const Chat = ({ username, roomId, remoteUserId }) => {
  const workspaceName = useSelector((state) => state.user.workspaceName);
  const profile = useSelector((state) => state.user.profile);
  const workspaceId = useSelector((state) => state.user.workspaceId);
  const { members } = useMembers(workspaceId);
  const [showMemberModal, setShowMemberModal] = useState(false);
const [selectedMembers, setSelectedMembers] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(roomId || null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showMap, setShowMap] = useState(true); // Default to true - show Virtual Space initially
  const [showMeeting, setShowMeeting] = useState(false);
  const [showVideoConference, setShowVideoConference] = useState(false);
  const [showTeamBuilder, setShowTeamBuilder] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDMMode, setIsDMMode] = useState(false);
  const [dmReceiverId, setDmReceiverId] = useState(null);
  const [dmReceiverName, setDmReceiverName] = useState("");
  const [unreadDMs, setUnreadDMs] = useState({});
  const [teams, setTeams] = useState([]);;
const [actionType, setActionType] = useState(null);

  const layoutPostedRef = useRef(false);
  const textareaRef = useRef(null);
  const mainRef = useRef(null);
  const socketRef = useRef(socket);
  const { startCall } = useVoiceCall(SOCKET_URL);
  const dmCacheRef = useRef({}); // In-memory cache only for current session

  // Fetch teams to get team names
  useEffect(() => {
    const fetchTeamsData = async () => {
      if (!workspaceId) return;
      try {
        const response = await getTeams(workspaceId);
        const teamsList = response?.data?.teams || response?.data || [];
        setTeams(teamsList);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      }
    };
    fetchTeamsData();
  }, [workspaceId]);

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
      setMessages(dmCacheRef.current[receiverId]);
    } else {
    }
    
    console.log("[DM] Starting DM with:", receiverName, receiverId);
  };

  const handleDeleteMessage = async (messageId) => {
  try {
    if (isDMMode) {
      // ---- Direct Message Delete ----
      const { deleteDirectMessage } = await import("../../api/authApi.js");
      await deleteDirectMessage(messageId);
      console.log("[DM] Deleted message:", messageId);

    } else {
      // ---- Channel Message Delete ----
      const { deleteChannelMessage } = await import("../../api/authApi.js");
      await deleteChannelMessage(messageId);
      console.log("[Channel] Deleted message:", messageId);
    }

    // ---- Remove from UI instantly ----
    setMessages((prev) => {
      const updated = prev.filter((m) => m._id !== messageId);

      // update DM cache
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
          
         
          try {
            const response = await getDirectMessages(workspaceId, selfId, dmReceiverId);
            
            let raw = [];
            if (response?.data?.messages && Array.isArray(response.data.messages)) {
              raw = response.data.messages;
            } else if (response?.data && Array.isArray(response.data)) {
              raw = response.data;
            } else {
              console.warn("[DM] Unexpected response structure:", response?.data);
            }
            
           
            
            // Update in-memory cache and set messages
            if (raw.length > 0) {
              dmCacheRef.current[dmReceiverId] = raw;
              setMessages(raw);
             
            } else {
             setMessages([]);
            }
            
          } catch (error) {
            console.error("[DM] Failed to fetch messages:", error);
            
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
  const selfId = profile?._id;

  // CHECK IF MESSAGE BELONGS TO ACTIVE DM
  const isForActiveDM =
    (senderId === selfId && receiverId === dmReceiverId) ||
    (senderId === dmReceiverId && receiverId === selfId);

  if (!isForActiveDM) {
    console.log("[DM] Message from another user → Unread only");

    // Add unread counter
    if (senderId !== selfId) {
      setUnreadDMs((prev) => ({
        ...prev,
        [senderId]: (prev[senderId] || 0) + 1,
      }));
    }

    return; 
  }

  setMessages((prev) => {
    // Avoid duplicates
    if (prev.some((m) => m._id === msg._id)) {
      console.log("[DM] Duplicate skipped:", msg._id);
      return prev;
    }
    // optimistic temp message → real one arrives
    const tempIndex = prev.findIndex((m) => {
      if (!m.tempId) return false;

      const sameSender = m.sender?._id === msg.sender?._id;
      const sameContent = m.content?.trim() === msg.content?.trim();

      const timeDiff = Math.abs(
        new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()
      );

      const isRecent = timeDiff < 5000; 

      return sameSender && sameContent && isRecent;
    });

    if (tempIndex !== -1) {
      const updated = [...prev];
      updated[tempIndex] = msg;

      // Update DM cache
      dmCacheRef.current[dmReceiverId] = updated;

      return updated;
    }

    const updated = [...prev, msg];
    dmCacheRef.current[dmReceiverId] = updated;

    return updated;
  });

  // Auto scroll
  setTimeout(() => {
    mainRef.current?.scrollTo({
      top: mainRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, 100);
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

          // Replace temp message 
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
  <>
    <ChatLayout
      sidebar={
        <Sidebar
          onChannelSelect={(channelId) => {
            if (isDMMode && dmReceiverId && messages.length > 0) {
              dmCacheRef.current[dmReceiverId] = messages;
              console.log("[DM] Cached messages in memory before switching to channel");
            }

            setActiveRoomId(channelId);
            setIsDMMode(false);
            setDmReceiverId(null);
            setDmReceiverName("");
            sessionStorage.removeItem("currentDM");
            
            // Hide all other views to show chat
            setShowMap(false);
            setShowTeamBuilder(false);
            setShowMeeting(false);
            setShowVideoConference(false);
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

          /* NEW: Modal trigger */
          onOpenMemberModal={(actionType) => {
            console.log("Open member modal:", actionType);
            setActionType(actionType);
            setShowMemberModal(true);
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
              : isDMMode
              ? `Direct Message - ${dmReceiverName}`
              : workspaceName || "Workspace"
          }
          onCallClick={handleCallClick}
        />

        <div className="flex-1 relative overflow-y-auto">
          {showMap && <Map />}
          {showTeamBuilder && <TeamBuilder />}
          {showMeeting && <ManagerMeeting />}
          {showVideoConference && <VideoConference />}

          {!showMap && !showTeamBuilder && !showMeeting && !showVideoConference && (
            <div className="flex flex-col h-full min-h-0">
              <div className="relative flex-1 overflow-y-auto space-y-4 scrollbar-hide min-h-0">
                <InfoBar
                  onSearchChange={setSearchQuery}
                  channelName={
                    isDMMode
                      ? dmReceiverName
                      : (teams.find(t => t._id === activeRoomId)?.name ||
                        activeRoomId ||
                        "Channel")
                  }
                  memberCount={0}
                  onlineCount={0}
                />

                <MessageList
                  messages={displayedMessages}
                  username={username}
                  onDeleteMessage={handleDeleteMessage}
                  currentUserId={profile?._id}
                />
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
                members={members}
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

    {/*  MODAL: Member MultiSelect Overlay */}
   
{showMemberModal && (
  <>
    {/* If user clicked "Create Team" */}
    {actionType === "team" && (
      <CreateTeamModal
        open={true}
        onClose={() => setShowMemberModal(false)}
        onChannelCreated={(channel) => {
          console.log("Team created with channel:", channel);
          setShowMemberModal(false);
        }}
      />
    )}

    {/* If user clicked "Add Members" */}
    {actionType === "add" && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-1000 p-4">
        <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6">
          <h2 className="text-xl font-semibold text-black mb-3">Add Members</h2>

          <MemberMultiSelect
            members={members}
            value={selectedMembers}
            onChange={setSelectedMembers}
            label="Select Members"
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowMemberModal(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                console.log("Added Members:", selectedMembers);
                setShowMemberModal(false);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)}

  </>
);

};

export default Chat;

