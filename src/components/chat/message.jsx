import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import down from "../../assets/down.svg";
import pdfIcon from "../../assets/space.svg";

const QUICK_EMOJIS = ["❤️", "😂", "👍", "😮", "😢", "👏"];

const MessageList = ({ messages, username }) => {
  const bottomRef = useRef(null);

  // Reactions per message
  const [messageReactions, setMessageReactions] = useState({}); 

  // Which message has quick reactions visible
  const [quickReactionsForMessage, setQuickReactionsForMessage] = useState(null);

  // Which message has full picker open
  const [pickerForMessage, setPickerForMessage] = useState(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addReaction = (msgIndex, emoji) => {
    setMessageReactions(prev => {
      const reactions = prev[msgIndex] || [];
      const existing = reactions.find(r => r.emoji === emoji);
      const updated = existing
        ? reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r)
        : [...reactions, { emoji, count: 1 }];
      return { ...prev, [msgIndex]: updated };
    });
  };

  const handleReactionClick = (msgIndex, emoji) => {
    setMessageReactions(prev => {
      const reactions = prev[msgIndex] || [];
      const updated = reactions
        .map(r => r.emoji === emoji ? { ...r, count: r.count - 1 } : r)
        .filter(r => r.count > 0);
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
            <div className={`flex items-start space-x-3 w-full ${isSentByUser ? "flex-row-reverse space-x-reverse" : ""}`}>
              {/* Avatar */}
              <div className="relative w-10 h-10 shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#5E9BFF]" />
              </div>

              {/* Message Content */}
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

                {/* Message Bubble */}
                <div
                  onDoubleClick={() =>
                    setQuickReactionsForMessage(quickReactionsForMessage === index ? null : index)
                  }
                  className="bg-white border border-[#E2E2E2] rounded-2xl p-4 shadow-sm w-full relative cursor-pointer"
                >
                  {msg.text && (
                    <p className="text-sm text-[#333] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {msg.file && (
                    <div className="mt-3 border border-[#E0E0E0] rounded-lg flex items-center justify-between p-2">
                      <div className="flex items-center space-x-2">
                        <img src={pdfIcon} alt="file" className="w-6 h-6" />
                        <div>
                          <p className="text-sm font-medium text-[#0E1219]">{msg.file}</p>
                          <p className="text-xs text-gray-500">10.5 MB</p>
                        </div>
                      </div>
                      <img src={down} alt="download" className="w-5 h-5 cursor-pointer" />
                    </div>
                  )}

                  {/* Quick Reaction Bar on double-click */}
                  {quickReactionsForMessage === index && (
                    <div className="absolute -top-12 left-0 flex space-x-1 z-50">
                      {QUICK_EMOJIS.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(index, emoji)}
                          className="bg-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}

                      {/* Add icon for full picker */}
                      <button
                        onClick={() => setPickerForMessage(index)}
                        className="bg-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform text-lg"
                      >
                        ➕
                      </button>
                    </div>
                  )}

                  {/* Full Emoji Picker */}
                  {pickerForMessage === index && (
                    <div className="absolute -top-64 left-0 z-50">
                      <EmojiPicker
                        onEmojiClick={emojiData => addReaction(index, emojiData.emoji)}
                        previewConfig={{ showPreview: false }}
                        searchDisabled
                        height={250}
                        width={300}
                      />
                    </div>
                  )}

                  {/* Reactions */}
                  {reactions.length > 0 && (
                    <div className="flex flex-wrap space-x-2 mt-1">
                      {reactions.map(r => (
                        <div
                          key={r.emoji}
                          onClick={() => handleReactionClick(index, r.emoji)}
                          className="flex items-center bg-gray-100 rounded-full px-2 py-0.5 text-xs cursor-pointer hover:bg-gray-200"
                        >
                          {r.emoji} <span className="ml-1">{r.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
