import React, { useEffect, useRef, useState } from "react";
import MessageReactions from "./rection.jsx";


const MessageList = ({ messages, username }) => {
  const bottomRef = useRef(null);
  const [messageReactions, setMessageReactions] = useState({});

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addReaction = (msgIndex, emoji) => {
    setMessageReactions((prev) => {
      const reactions = prev[msgIndex] || [];
      const existing = reactions.find((r) => r.emoji === emoji);
      const updated = existing
        ? reactions.map((r) =>
            r.emoji === emoji ? { ...r, count: r.count + 1 } : r
          )
        : [...reactions, { emoji, count: 1 }];
      return { ...prev, [msgIndex]: updated };
    });
  };

  const handleReactionClick = (msgIndex, emoji) => {
    setMessageReactions((prev) => {
      const reactions = prev[msgIndex] || [];
      const updated = reactions
        .map((r) =>
          r.emoji === emoji ? { ...r, count: r.count - 1 } : r
        )
        .filter((r) => r.count > 0);
      return { ...prev, [msgIndex]: updated };
    });
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-4">
      {messages.map((msg, index) => {
        const isSentByUser = msg.sender === username;
        const reactions = messageReactions[index] || [];

        return (
          <div key={index} className="flex w-full group">
            <div
              className={`flex items-start space-x-3 w-full ${
                isSentByUser ? "flex-row space-x-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div className="relative w-10 h-10 shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#5E9BFF]" />
              </div>

              {/* Message Bubble + Reactions */}
              <div className="flex flex-col space-y-2 w-full relative">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold text-[#0E1219]">
                    {msg.sender || "Fullname"}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <MessageReactions
                  msgIndex={index}
                  reactions={reactions}
                  onAddReaction={addReaction}
                  onRemoveReaction={handleReactionClick}
                >
                  {msg.text && (
                    <p className="text-sm text-[#333] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  )}
                </MessageReactions>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;