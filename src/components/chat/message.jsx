import React, { useEffect, useRef, useState } from "react";
import MessageReactions from "./rection.jsx";

const MessageList = ({ messages, username, onDeleteMessage, currentUserId, hasMore, onLoadMore }) => {
  const bottomRef = useRef(null);
  const [messageReactions, setMessageReactions] = useState({});
  const [lightboxMedia, setLightboxMedia] = useState(null); // { url, name }

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
        .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1 } : r))
        .filter((r) => r.count > 0);
      return { ...prev, [msgIndex]: updated };
    });
  };

  const handleMediaClick = (url, name) => {
    if (!url) return;
    setLightboxMedia({ url, name: name || "Media" });
  };

  return (
    <div className="flex-1 overflow-x-hidden space-y-6 p-4 min-w-0">
      {hasMore && (
        <div className="flex justify-center my-2">
          <button
            onClick={onLoadMore}
            className="px-4 py-1.5 bg-[#3D1B5F] hover:bg-[#5C0EA4] text-white text-xs font-semibold rounded-full shadow transition-all"
          >
            Load Older Messages
          </button>
        </div>
      )}
      {messages.map((msg, index) => {
        const selfId = currentUserId || localStorage.getItem("userId");
        const senderId = typeof msg.sender === "object" ? (msg.sender?._id || msg.sender?.id) : msg.sender;
        const isSentByUser = String(senderId) === String(selfId) || msg.sender === username || msg.sender?.username === username;
        const reactions = messageReactions[index] || [];

        return (
         <div key={msg._id || index} className="flex w-full max-w-full min-w-0 group relative">
  <div
    className={`flex items-start space-x-3 w-full ${
      isSentByUser ? "flex-row space-x-reverse" : ""
    }`}
  >
    {/* Avatar */}
    <div className="relative w-10 h-10 shrink-0">
      <img
  src={msg.sender?.avatar || "https://api.dicebear.com/9.x/adventurer/svg?seed=Default"}
  alt="avatar"
  className="w-10 h-10 rounded-full object-cover"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://api.dicebear.com/9.x/adventurer/svg?seed=Default";
  }}
/>
    </div>

  {/* Message Bubble + Reactions */}
  <div className="flex flex-col space-y-2 w-full relative min-w-0">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-semibold text-[#0E1219]">
          {isSentByUser
            ? "You"
            : (typeof msg.sender === "object"
                ? (msg.sender?.fullName || msg.sender?.username || "User")
                : msg.sender || "User")}
        </p>
        <span className="text-xs text-gray-500">
          {msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Invalid Date"}
        </span>
      </div>

      <MessageReactions
        msgIndex={index}
        reactions={reactions}
        onAddReaction={addReaction}
        onRemoveReaction={handleReactionClick}
      >
        {msg.content && (
          <div>
            <p className="text-sm w-auto text-[#333] leading-relaxed whitespace-pre-wrap" style={{ overflowWrap: 'anywhere', wordBreak: 'normal' }}>
              {msg.content}
            </p>
          </div>
        )}
        {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {msg.attachments.map((att, attIdx) => {
              const fileName = att.name || att.filename || "Attachment";
              const isImage =
                (att.mimeType && att.mimeType.startsWith("image/")) ||
                (att.url && (att.url.startsWith("data:image/") || att.url.match(/\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i))) ||
                (fileName && fileName.match(/\.(jpeg|jpg|png|gif|webp)$/i));

              return (
                <div
                  key={att.fileId || att.url || attIdx}
                  className="group border border-[#BFA2E1] rounded-md p-2 bg-[#EFE7F6] max-w-xs cursor-pointer hover:border-[#5C0EA4] transition-all"
                  onClick={() => handleMediaClick(att.url, fileName)}
                >
                  {isImage && att.url ? (
                    <img
                      src={att.url}
                      alt={fileName}
                      className="rounded max-h-56 w-full object-cover hover:scale-[1.02] transition-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 flex items-center justify-center text-xs bg-[#5C0EA4] text-white rounded font-bold">
                        {fileName.split('.').pop()?.slice(0,4)?.toUpperCase() || 'FILE'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold truncate" title={fileName}>{fileName}</p>
                        {att.size && (
                          <p className="text-[10px] text-[#707070]">{(att.size/1024).toFixed(1)} KB</p>
                        )}
                      </div>
                    </div>
                  )}
                  {att.url && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMediaClick(att.url, fileName);
                      }}
                      className="mt-2 inline-block text-[11px] text-[#5C0EA4] font-semibold underline hover:opacity-80"
                    >
                      View Full Preview
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </MessageReactions>
    </div>
  </div>
  
  {/* Delete button - only show for messages sent by current user */}
  {msg._id && onDeleteMessage && currentUserId && msg.sender?._id === currentUserId && (
    <button
      onClick={() => onDeleteMessage(msg._id)}
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
      title="Delete message"
    >
      ×
    </button>
  )}
</div>
        );
      })}

      <div ref={bottomRef} />

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxMedia && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setLightboxMedia(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center bg-[#200539] p-4 rounded-2xl border border-[#5C0EA4] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxMedia(null)}
              className="absolute top-3 right-3 text-white bg-[#5C0EA4] hover:bg-[#7015c2] w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all shadow-md z-10"
            >
              ✕
            </button>

            {/* Media Title */}
            <h3 className="text-white text-base font-semibold mb-3 truncate max-w-md">
              {lightboxMedia.name}
            </h3>

            {/* Image / Content Preview */}
            <div className="overflow-auto max-h-[70vh] flex items-center justify-center rounded-lg bg-[#110221] p-2">
              <img
                src={lightboxMedia.url}
                alt={lightboxMedia.name}
                className="max-h-[65vh] max-w-full object-contain rounded"
              />
            </div>

            {/* Actions Bar */}
            <div className="mt-4 flex items-center gap-4">
              <a
                href={lightboxMedia.url}
                download={lightboxMedia.name}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-[#5C0EA4] hover:bg-[#7015c2] text-white font-medium text-sm rounded-xl shadow transition-all flex items-center gap-2"
              >
                📥 Download / Open Direct Link
              </a>
              <button
                onClick={() => setLightboxMedia(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium text-sm rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
