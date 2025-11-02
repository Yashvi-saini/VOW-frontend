import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import user from "../../assets/icon.svg";
import msg from "../../assets/msg.svg";
import call from "../../assets/call.svg";
import video from "../../assets/Video.svg";
import emoji from "../../assets/emoji.svg";
import share from "../../assets/share.svg";
import battherate from "../../assets/battherate.svg";
import image from "../../assets/image.svg";
import send from "../../assets/send.svg";
import guser from "../../assets/guser.svg";
import pin from "../../assets/pin.svg";
import search from "../../assets/search.svg";
import cross from "../../assets/cross.svg";
import MessageList from "../chat/message.jsx"; 
import EmojiSelector from "../chat/emojipicker.jsx";
import Sidebar from "../chat/sidebar.jsx";
import { sendMessageToChannel } from "../../api/authApi.js"; // or wherever you defined it
import { fetchChannelMessages } from "../../api/authApi.js"; 
const Chat = ({ username, roomId }) => {
  // keep an internal roomId state so parentless actions (like creating a channel)
  // can set the active channel for this Chat instance
  const [activeRoomId, setActiveRoomId] = useState(roomId || null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef(null);
  const textareaRef = useRef(null);
  const mainRef = useRef(null);
  const handleEmojiSelect = useCallback(
    (selectedEmoji) => setMessageInput((prev) => prev + selectedEmoji),
    []
  );

useEffect(() => {
  if (roomId !== activeRoomId) {
    setActiveRoomId(roomId);
  }
}, [roomId]);
useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto"; // reset height
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`; // max ~10 lines
  }
}, [messageInput]);

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
  if (messageInput.trim() === "") return;

  const message = {
    channelId: activeRoomId,
    content: messageInput,
    attachments: [],
    sender: {
      _id: user._id,
      username: user.name,
      avatar: user.avatar,
    },
    createdAt: new Date().toISOString(),
  };


  try {
    // Emit via WebSocket for live delivery
    socketRef.current.emit("message", message);

    // Persist via REST API (only if we have an active channel)
    if (activeRoomId) {
      await sendMessageToChannel(activeRoomId, message.content, message.attachments);
    } else {
      console.warn("No active channel selected. Message will not be saved to server.");
    }
  } catch (err) {
    console.error("Failed to send message:", err);
  }

  setMessageInput("");
};

  return (
    <div className="flex h-screen bg-[#F3F3F6] text-[#0E1219]">
  <Sidebar onChannelSelect={setActiveRoomId} />

      {/* Main Chat Area */}
  <main ref={mainRef} className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="bg-[#200539] border-b border-[#BCBCBC] p-4 flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-white">Workspace Name</h3>
          <div className="flex gap-2 ">
            <img
              src={user}
              alt=""
              className="border -2 border-[#9982B4] px-3 py-2 rounded-xl"
            />
            <img
              src={msg}
              alt=""
              className="border -2 border-[#9982B4] px-2 py-2 rounded-xl"
            />
            <img
              src={call}
              alt=""
              className="border -2 border-[#9982B4] px-2 py-2 rounded-xl"
            />
            <img
              src={video}
              alt=""
              className="border -2 border-[#9982B4] px-2 py-2 rounded-xl"
            />
          </div>
        </header>

        {/* Messages */}
        <div className=" relative flex-1 overflow-y-auto space-y-4">
          <div className=" sticky top-0 flex bg-gray-200 justify-between p-3 z-1">
            <div className="flex items-center">
              <p className=" text-[26px] mr-2 ">#</p>
              <p className=" text-2xl pt-0.5">Team 1</p>
            </div>
            <div className="flex items-center gap-3 text-xl">
              <img src={guser} alt="" />
              <p>10 members</p>
              <p>8 online</p>
            </div>
            <div className="flex gap-7 mr-3 ">
              <img src={pin} alt="" className="w-4" />
              <img src={search} alt="" className="w-4" />
              <img src={cross} alt="" className="w-3" />
            </div>
          </div>
          
          
          <MessageList messages={messages} username={username} />

        </div>

        {/* Input */}
       <footer className="border-[#BCBCBC] p-4">
  <div className="flex items-end border-2 rounded-2xl mx-12 pr-4 py-2">
    {/* Left section: Textarea + icons */}
    <div className="flex flex-col w-full">
      <textarea
  className="w-full px-2.5 py-2 border-none rounded-md outline-none resize-none overflow-y-auto hide-scrollbar max-h-40"
  placeholder="Write a message..."
  ref={textareaRef}
  value={messageInput}
  onChange={(e) => setMessageInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }}
  rows={1}
/>
      {/* Icons below textarea */}
      <div className=" flex space-x-3 ml-2 pt-1 pl-1 ">
        <div className=" flex space-x-3 ml-2 pt-1 pl-1">
  <EmojiSelector
    icon={emoji}
    boundaryRef={mainRef}
    onSelect={handleEmojiSelect}
  />
</div>
        <img src={battherate} alt="mention" className="cursor-pointer" />
        <img src={share} alt="share" className="cursor-pointer" />
        <img src={image} alt="image" className="cursor-pointer" />
      </div>
    </div>

    {/* Send Button */}
    <button
      className="ml-4 text-white rounded-md transition shrink-0 mb-5"
      onClick={sendMessage}
    >
      <img src={send} alt="send" />
    </button>
  </div>
</footer>
      </main>
    </div>
  );
}

export default Chat;
