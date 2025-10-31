import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import user from "../../assets/icon.svg";
import msg from "../../assets/msg.svg";
import call from "../../assets/call.svg";
import video from "../../assets/video.svg";
import person from "../../assets/account_circle.svg";
import attherate from "../../assets/At sign.svg";
import group from "../../assets/groups.svg";
import space from "../../assets/space.svg";
import today from "../../assets/today.svg";
import down from "../../assets/down.svg";
import add from "../../assets/add.svg";
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
import EmojiPicker from 'emoji-picker-react';

const Chat = ({ username, roomId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef(null);
  const textareaRef = useRef(null);
  const [showPicker, setShowPicker] = useState(false);


useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto"; // reset height
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`; // max ~10 lines
  }
}, [messageInput]);

  useEffect(() => {
    socketRef.current = io("http://localhost:8001", {
      transports: ["websocket", "polling"],
    });

    socketRef.current.emit("joinRoom", roomId);

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
      socketRef.current.off("message");
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (messageInput.trim() === "") return;
    const message = {
      text: messageInput,
      sender: username,
      timestamp: new Date().toISOString(),
    };
    socketRef.current.emit("message", { roomId, message });
    setMessageInput("");
  };
  

  return (
    <div className="flex h-screen bg-[#F3F3F6] text-[#0E1219]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#200539] border-r border-[#BCBCBC] p-4 pr-5">
        <h2 className="text-xl font-bold text-white mb-6">VOW</h2>
        <nav className="space-y-4 text-xl font-normal ">
          <div className=" text-white flex gap-1 ">
            <img src={person} alt="" />
            Dashboard
          </div>
          <div className="text-white flex gap-2">
            <img src={space} alt="" />
            Virtual Space
          </div>
          <div className="text-white flex gap-1">
            <img src={attherate} alt="" />
            Mentions
          </div>
          <div className="text-white flex gap-1">
            <img src={today} alt="" />
            Events
          </div>
          <div className="text-white flex gap-1">
            <img src={group} alt="" />
            Teams
          </div>
        </nav>
        <div>
          <div className="flex items-center justify-between text-white bg-[#200539]  py-2">
            <div className="flex items-center gap-2">
              <img src={down} alt="down arrow " className="mt-2.5 w-6" />
              <h3 className="text-xl">Team</h3>
            </div>
            <img src={add} alt="add icon" />
          </div>
          <div className="flex items-center justify-between text-white bg-[#200539] ">
            <div className="flex items-center gap-2 pl-6">
              <p className="text-[26px] text-[#BCBCBC]">#</p>
              <h3 className="text-[#BCBCBC] text-xl">Team1</h3>
            </div>
            <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
              {" "}
              3
            </div>
          </div>
          <div className="flex items-center justify-between text-white bg-[#200539]  ">
            <div className="flex items-center gap-2 pl-6">
              <p className="text-[26px] text-[#BCBCBC]">#</p>
              <h3 className="text-[#BCBCBC] text-xl">Team1</h3>
            </div>
            <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
              {" "}
              3
            </div>
          </div>
          <div className="flex items-center justify-between text-white bg-[#200539]  ">
            <div className="flex items-center gap-2 pl-6">
              <p className="text-[26px] text-[#BCBCBC]">#</p>
              <h3 className="text-[#BCBCBC] text-xl">Team1</h3>
            </div>
            <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
              {" "}
              3
            </div>
          </div>
          <div className="flex items-center justify-between text-white bg-[#200539]  ">
            <div className="flex items-center gap-2 pl-6">
              <p className="text-[26px] text-[#BCBCBC]">#</p>
              <h3 className="text-[#BCBCBC] text-xl">Team1</h3>
            </div>
            <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
              {" "}
              3
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-white bg-[#200539]  py-2">
            <div className="flex items-center gap-2">
              <img src={down} alt="down arrow " className="mt-2.5 w-6" />
              <h3 className="text-xl">Team</h3>
            </div>
            <img src={add} alt="add icon" />
          </div>
          <div className="flex items-center justify-between text-white bg-[#200539] ">
            <div className="flex items-center gap-2 pl-6">
              <p className="text-[26px] text-[#BCBCBC]">#</p>
              <h3 className="text-[#BCBCBC] text-xl">Team1</h3>
            </div>
            <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
              {" "}
              3
            </div>
          </div>
          <div className="flex items-center justify-between text-white bg-[#200539]  ">
            <div className="flex items-center gap-2 pl-6">
              <p className="text-[26px] text-[#BCBCBC]">#</p>
              <h3 className="text-[#BCBCBC] text-xl">Team1</h3>
            </div>
            <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
              {" "}
              3
            </div>
          </div>
          <div className="flex items-center justify-between text-white bg-[#200539]  ">
            <div className="flex items-center gap-2 pl-6">
              <p className="text-[26px] text-[#BCBCBC]">#</p>
              <h3 className="text-[#BCBCBC] text-xl">Team1</h3>
            </div>
            <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
              {" "}
              3
            </div>
          </div>
          <div className="flex items-center justify-between text-white bg-[#200539]  ">
            <div className="flex items-center gap-2 pl-6">
              <p className="text-[26px] text-[#BCBCBC]">#</p>
              <h3 className="text-[#BCBCBC] text-xl">Team1</h3>
            </div>
            <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
              {" "}
              3
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
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
        <div className="flex-1 overflow-y-auto space-y-4">
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
  <div className="flex items-end border-2 rounded-2xl mx-12 px-4 py-2">
    {/* Left section: Textarea + icons */}
    <div className="flex flex-col w-full">
      <textarea
  className="w-full px-3 py-2 border-none rounded-md outline-none resize-none overflow-y-auto hide-scrollbar max-h-40"
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
      <div className="flex space-x-3 ml-2 pt-1 ">
        <img src={emoji} alt="emoji" className="cursor-pointer" onClick={() => setShowPicker((prev) => !prev)}/>
         {showPicker && (
        <div className="absolute bottom-25 left-80 z-10 ">
          <EmojiPicker
            onEmojiClick={(emojiData) =>
              setMessageInput((prev) => prev + emojiData.emoji)
             
            }
            previewConfig={{ showPreview: false }}
            width={350}
            height={300}
            emojiStyle="native"
            style={{
              
            }}
          />
        </div>
      )}
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
