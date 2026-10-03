import React, { useState, useRef } from "react";

const QUICK_EMOJIS = ["❤️", "😂", "👍", "😮", "😢", "👏"];

const MessageReactions = ({
  msgId,
  reactions = [],
  currentUserId,
  onReact,
  children,
}) => {
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
      <div
        className={`absolute flex space-x-1 z-40 transform transition-all duration-300 ${
          quickReactionsVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{
          top: "-2.2rem",
          left: "50%",
          transform: quickReactionsVisible
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(-2px)",
        }}
      >
        <div className="flex space-x-1 bg-white rounded-full shadow-lg px-2.5 py-1 border border-gray-200">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReact?.(emoji);
                setQuickReactionsVisible(false);
              }}
              className="p-1 hover:scale-125 transition-transform text-base cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div>{children}</div>

      {Array.isArray(reactions) && reactions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {reactions.map((r) => {
            const count = Array.isArray(r.users) ? r.users.length : (r.count || 0);
            if (count <= 0) return null;
            const hasReacted = Array.isArray(r.users)
              ? r.users.some(
                  (u) => String(u?._id || u?.id || u) === String(currentUserId)
                )
              : false;

            return (
              <button
                key={r.emoji}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReact?.(r.emoji);
                }}
                className={`flex items-center rounded-full px-2.5 py-0.5 text-xs cursor-pointer transition-all ${
                  hasReacted
                    ? "bg-[#EDE3FA] border border-[#AC92CB] text-[#5C0EA4] font-semibold hover:bg-[#DBCBF3]"
                    : "bg-gray-100 border border-transparent text-gray-700 hover:bg-gray-200"
                }`}
                title={hasReacted ? "Click to remove reaction" : "Click to react"}
              >
                <span>{r.emoji}</span>
                <span className="ml-1 text-[11px] font-medium">{count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessageReactions;