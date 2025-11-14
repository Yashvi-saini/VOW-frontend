import React, { useState, useRef } from "react";

const QUICK_EMOJIS = ["❤️", "😂", "👍", "😮", "😢", "👏"];

const MessageReactions = ({ msgIndex, reactions, onAddReaction, onRemoveReaction, children }) => {
  const [quickReactionsVisible, setQuickReactionsVisible] = useState(false);
  const containerRef = useRef(null);

  const handleMouseEnter = () => {
    setQuickReactionsVisible(true);
  };

  const handleMouseLeave = () => {
    setQuickReactionsVisible(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative bg-white border border-[#E2E2E2] rounded-2xl p-4 shadow-sm w-full cursor-pointer transition-all duration-200"
    >
      {/* Quick Reactions */}
      <div
        className={`absolute flex space-x-1 z-40 transform transition-all duration-300 ${
          quickReactionsVisible
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{
          top: '-2rem',
          left: '50%',
          transform: quickReactionsVisible
            ? 'translateX(-50%) translateY(0)' 
            : 'translateX(-50%) translateY(-2px)',
        }}
      >
        <div className="flex space-x-1 bg-white rounded-full shadow-sm px-2 py-1 border border-gray-200">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onAddReaction(msgIndex, emoji)}
              className="p-1 hover:scale-110 transition-transform text-sm"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Render message content */}
      <div>{children}</div>

      {/* Reactions */}
      {reactions?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {reactions.map((r) => (
            <div
              key={r.emoji}
              onClick={() => onRemoveReaction(msgIndex, r.emoji)}
              className="flex items-center bg-gray-100 rounded-full px-2 py-0.5 text-xs cursor-pointer hover:bg-gray-200 transition-colors"
            >
              {r.emoji} <span className="ml-1">{r.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageReactions;