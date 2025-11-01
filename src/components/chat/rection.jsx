import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

const QUICK_EMOJIS = ["❤️", "😂", "👍", "😮", "😢", "👏"];

const MessageReactions = ({ msgIndex, reactions, onAddReaction, onRemoveReaction, children }) => {
  const [quickReactionsVisible, setQuickReactionsVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const pickerRef = useRef(null);

  // 🟡 Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerVisible(false);
      }
    };
    if (pickerVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pickerVisible]);

  // Hover handler
const handleMouseEnter = () => {
  if (!pickerVisible) {        // <-- only show quick reactions if picker is not open
    setQuickReactionsVisible(true);
  }
};

const handleMouseLeave = () => {
  if (!pickerVisible) {
    setQuickReactionsVisible(false);
  }
};


  return (
    <div
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  className="relative bg-white border border-[#E2E2E2] rounded-2xl p-4 shadow-sm w-full cursor-pointer transition-all duration-200"
>
      {/* Quick Reactions */}
      <div
        className={`absolute -top-8 left-25 flex space-x-1 z-50 transform transition-all duration-300 ${
          quickReactionsVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onAddReaction(msgIndex, emoji)}
            className="bg-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform"
          >
            {emoji}
          </button>
        ))}

        {/* Full Picker Toggle */}
        <button
  onClick={() => {
    setPickerVisible(!pickerVisible);
    setQuickReactionsVisible(false);  // hide quick reactions
  }}
  className="bg-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform text-lg"
>
  ➕
</button>
      </div>

      {/* Full Emoji Picker */}
      {pickerVisible && (
        <div ref={pickerRef} className="absolute top-20 left-90 z-50"
        style={{ overflow: "visible" }}
        >
          
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              onAddReaction(msgIndex, emojiData.emoji);
              setPickerVisible(false);
            }}
            previewConfig={{ showPreview: false }}
            searchDisabled
            height={400}
            width={300}
          />
          
        </div>
      )}

      {/* Render message content */}
      <div>{children}</div>

      {/* Reactions */}
      {reactions?.length > 0 && (
        <div className="flex flex-wrap space-x-2 mt-2">
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

