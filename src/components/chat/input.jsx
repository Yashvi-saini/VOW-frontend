import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import emoji from "../../assets/emoji.svg";
import battherate from "../../assets/battherate.svg";
import share from "../../assets/share.svg";
import image from "../../assets/image.svg";
import send from "../../assets/send.svg";
import EmojiSelector from "../../components/chat/emojipicker.jsx";
import { uploadFileToWorkspace } from "../../api/file";

const InputBox = ({
  messageInput,
  setMessageInput,
  sendMessage,
  mainRef,
  textareaRef,
  handleEmojiSelect,
  attachments,
  setAttachments,
}) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  
  // Get workspace info from Redux store
  const userState = useSelector((state) => state.user);
  const workspaceId = userState?.workspaceId;

  const handleTriggerFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Check if user has selected a workspace
    if (!workspaceId) {
      console.error("No workspace selected for file upload");
      alert("Please join or select a workspace before uploading files.");
      return;
    }

    setUploading(true);
    const uploadedMeta = [];
    
    for (const f of files) {
      try {
        console.log(`[Chat] Uploading file "${f.name}" to workspace: ${workspaceId}`);
        
        const uploaded = await uploadFileToWorkspace(f, workspaceId);
        
        const meta = {
          fileId: uploaded._id || uploaded.id,
          url: uploaded.url || uploaded.fileUrl || uploaded.location,
          name: uploaded.originalName || uploaded.filename || f.name,
          size: f.size,
          mimeType: f.type,
        };
        
        uploadedMeta.push(meta);
        console.log(`[Chat] File uploaded successfully: ${meta.name}`);
      } catch (err) {
        console.error("Upload failed for", f.name, err);
        
        // Show user-friendly error message
        const errorMsg = err.message || `Failed to upload ${f.name}`;
        alert(`Upload failed: ${errorMsg}`);
      }
    }
    
    if (uploadedMeta.length) {
      setAttachments((prev) => [...prev, ...uploadedMeta]);
      
      // Show success message if some files uploaded
      if (uploadedMeta.length === files.length) {
        console.log(`[Chat] All ${uploadedMeta.length} files uploaded successfully`);
      } else {
        console.log(`[Chat] ${uploadedMeta.length} of ${files.length} files uploaded successfully`);
      }
    }
   
    setUploading(false);
    e.target.value = "";
  };

  const removeAttachment = (fileId) => {
    setAttachments((prev) => prev.filter((a) => a.fileId !== fileId));
  };

  return (
    <footer className="border-[#BCBCBC] p-4 w-full max-w-full">
      <div className="flex items-end border-2 rounded-2xl w-full max-w-full pr-4 py-2">
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
          {/* Attachment previews */}
          {attachments && attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 px-2">
              {attachments.map((att) => (
                <div
                  key={att.fileId}
                  className="group flex items-center gap-2 bg-[#EFE7F6] border border-[#BFA2E1] rounded-md px-2 py-1 max-w-[180px]"
                >
                  {att.mimeType && att.mimeType.startsWith("image/") ? (
                    <img
                      src={att.url}
                      alt={att.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <span className="w-8 h-8 flex items-center justify-center text-xs bg-[#5C0EA4] text-white rounded">
                      {att.name.split('.').pop().slice(0,4).toUpperCase()}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate" title={att.name}>
                      {att.name}
                    </p>
                    <p className="text-[10px] text-[#707070]">
                      {(att.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.fileId)}
                    className="text-[10px] text-[#CC0404] opacity-70 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Icons below textarea */}
          <div className="flex space-x-3 ml-2 pt-1 pl-1">
            <EmojiSelector
              icon={emoji}
              boundaryRef={mainRef}
              onSelect={handleEmojiSelect}
            />
            <img src={battherate} alt="mention" className="cursor-pointer" />
            <img 
              src={share} 
              alt="attach files" 
              className={`cursor-pointer ${uploading ? 'opacity-50' : 'hover:opacity-80'}`}
              onClick={uploading ? undefined : handleTriggerFile} 
            />
            <img 
              src={image} 
              alt="attach images" 
              className={`cursor-pointer ${uploading ? 'opacity-50' : 'hover:opacity-80'}`}
              onClick={uploading ? undefined : handleTriggerFile} 
            />
            {uploading && (
              <div className="flex items-center text-xs text-blue-600">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-1"></div>
                Uploading...
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="*/*"
              disabled={uploading}
              className="hidden"
              onChange={handleFilesSelected}
            />
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