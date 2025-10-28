import React, { useState, useEffect } from "react";
import socket from "../chat/socket.jsx"; 

export default function ChatApp({ username = "You", roomId = "room1" }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit("join_room", roomId);
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      roomId,
      sender: username,
      text: message,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", msgData);
    setChat((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow"
      >
        {open ? "Close Chat" : "Start Chat"}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">

          <div className="p-4 bg-blue-600 text-white font-bold">
            Conversation
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded max-w-[75%] ${
                  msg.sender === username
                    ? "bg-blue-100 self-end text-right ml-auto"
                    : "bg-gray-200 self-start"
                }`}
              >
                <span className="font-semibold">{msg.sender}: </span>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border rounded px-2 py-1 mr-2"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-1 bg-blue-600 text-white rounded"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}