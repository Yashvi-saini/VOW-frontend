import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

function Chat({ username, roomId }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:8001", {
      transports: ["websocket", "polling"]
    });

    // Join the specified room
    socketRef.current.emit("joinRoom", roomId);

    socketRef.current.on("connect", () => {
      console.log("connected", socketRef.current.id);
    });

   socketRef.current.on("message", (data) => {
  const message = data.message; // extract the nested message
  setMessages(prev => [...prev, message]);
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
      timestamp: new Date().toISOString()
    };
    socketRef.current.emit("message", { roomId, message });
    setMessageInput("");
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-600">
      <div className="bg-white rounded-lg w-96 h-96 p-4 shadow-md">
        <div className="flex flex-col h-full">
          <div className="flex-1 p-2 overflow-y-auto bg-gray-200 rounded-md">
            {messages.map((msg, index) => {
  const isSentByUser = msg.sender === username;
  return (
    <div
      key={index}
      className={`flex flex-col mb-2 ${
        isSentByUser ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`p-2 rounded-md max-w-[80%] ${
          isSentByUser ? "bg-green-500 text-white" : "bg-blue-500 text-gray-200"
        }`}
      >
        <strong>{msg.sender}:</strong> {msg.text}
      </div>
      <span className="text-gray-800 text-xs">
        {new Date(msg.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
})}
          </div>
          <div className="p-2 border-t border-gray-300">
            <div className="flex">
              <input
                type="text"
                className="w-full px-2 py-1 border rounded-l-md outline-none"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;