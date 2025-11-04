import React, { useRef } from "react";
import emoji from "../../assets/emoji.svg";
import battherate from "../../assets/battherate.svg";
import share from "../../assets/share.svg";
import image from "../../assets/image.svg";
import send from "../../assets/send.svg";
import EmojiSelector from "../../components/chat/emojipicker.jsx";

const InputBox = ({
  messageInput,
  setMessageInput,
  sendMessage,
  mainRef,
  textareaRef,
  handleEmojiSelect,
}) => {
  return (
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
          <div className="flex space-x-3 ml-2 pt-1 pl-1">
            <EmojiSelector
              icon={emoji}
              boundaryRef={mainRef}
              onSelect={handleEmojiSelect}
            />
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
  );
};

export default InputBox;