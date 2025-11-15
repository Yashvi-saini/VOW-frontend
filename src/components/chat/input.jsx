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
  members = [],
}) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  
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

  // Filter members based on mention query
  const filteredMembers = mentionQuery
    ? members.filter(m => 
        (m.fullName?.toLowerCase().includes(mentionQuery.toLowerCase()) || 
         m.username?.toLowerCase().includes(mentionQuery.toLowerCase()))
      )
    : members;

  // Handle @ symbol detection and mention dropdown
  const handleInputChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setMessageInput(value);
    
    // Find last @ before cursor
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      // Check if there's a space between @ and cursor
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      if (!textAfterAt.includes(' ')) {
        setMentionQuery(textAfterAt);
        setMentionPosition(lastAtIndex);
        setShowMentionDropdown(true);
        setSelectedMentionIndex(0);
        return;
      }
    }
    
    setShowMentionDropdown(false);
  };

  // Handle member selection from dropdown
  const selectMention = (member) => {
    const memberName = member.fullName || member.username || 'User';
    const beforeMention = messageInput.substring(0, mentionPosition);
    const afterMention = messageInput.substring(mentionPosition + mentionQuery.length + 1);
    const newValue = `${beforeMention}@${memberName} ${afterMention}`;
    
    setMessageInput(newValue);
    setShowMentionDropdown(false);
    setMentionQuery('');
    
    // Focus back on textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
      const newCursorPos = mentionPosition + memberName.length + 2;
      setTimeout(() => {
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  // Handle keyboard navigation in mention dropdown
  const handleKeyDown = (e) => {
    if (showMentionDropdown && filteredMembers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => 
          prev < filteredMembers.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => 
          prev > 0 ? prev - 1 : filteredMembers.length - 1
        );
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        selectMention(filteredMembers[selectedMentionIndex]);
        return;
      } else if (e.key === 'Escape') {
        setShowMentionDropdown(false);
        return;
      }
    }
    
    if (e.key === 'Enter' && !e.shiftKey && !showMentionDropdown) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <footer className="border-[#BCBCBC] p-4 w-full max-w-full relative">
      <div className="flex items-end border-2 rounded-2xl w-full max-w-full pr-4 py-2">
        {/* Left section: Textarea + icons */}
        <div className="flex flex-col w-full">
          <textarea
            className="w-full px-2.5 py-2 border-none rounded-md outline-none resize-none overflow-y-auto hide-scrollbar max-h-40"
            placeholder="Write a message... (type @ to mention)"
            ref={textareaRef}
            value={messageInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          {/* Mention Dropdown */}
          {showMentionDropdown && filteredMembers.length > 0 && (
            <div className="absolute bottom-full left-2 mb-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto w-64 z-50">
              {filteredMembers.map((member, index) => (
                <div
                  key={member._id}
                  onClick={() => selectMention(member)}
                  className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${
                    index === selectedMentionIndex
                      ? 'bg-[#5C0EA4] text-white'
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-[#2DB3FF]"></span>
                  <span className="text-sm font-medium">
                    {member.fullName || member.username || 'User'}
                  </span>
                  {member.role && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ml-auto ${
                      index === selectedMentionIndex ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      {member.role}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
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
            <img 
              src={battherate} 
              alt="mention" 
              className="cursor-pointer hover:opacity-80" 
              onClick={() => {
                const cursorPos = textareaRef.current?.selectionStart || messageInput.length;
                const newValue = messageInput.substring(0, cursorPos) + '@' + messageInput.substring(cursorPos);
                setMessageInput(newValue);
                if (textareaRef.current) {
                  textareaRef.current.focus();
                  setTimeout(() => {
                    textareaRef.current.setSelectionRange(cursorPos + 1, cursorPos + 1);
                    // Trigger mention detection
                    handleInputChange({ 
                      target: { 
                        value: newValue, 
                        selectionStart: cursorPos + 1 
                      } 
                    });
                  }, 0);
                }
              }}
            />
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