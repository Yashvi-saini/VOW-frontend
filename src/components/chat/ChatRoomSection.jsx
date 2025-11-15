import React, { useState, useEffect } from "react";
import down from "../../assets/down.svg";
import right from "../../assets/right arrow.svg";
import { getChannels } from "../../api/authApi";
import { useSelector } from "react-redux";
import { useMembers } from "../useMembers";
import chaticon from "../../assets/chat.svg";
const ChatRoomSection = ({ title = "Chat Room", onChannelSelect, onStartDM, unreadDMs = {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [channels, setChannels] = useState([]);
  const { workspaceId } = useSelector((state) => state.user);
  const profile = useSelector((state) => state.user.profile);
  const { members } = useMembers(workspaceId);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const fetchChannels = async () => {
      if (!workspaceId) return;
      try {
        const response = await getChannels(workspaceId);
        const channelList = response?.data || [];
        setChannels(channelList);
      } catch (err) {
        console.error("Failed to fetch channels for Chat Room", err);
      }
    };

    fetchChannels();
  }, [workspaceId]);

  // Filter out current user from members list
  const otherMembers = members.filter(m => m._id !== profile?._id);

  return (
    <div className="mt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between text-white bg-[#200539] py-2 px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleToggleCollapse}>
          <img src={chaticon} alt="" className="w-5 h-5 mr-1" />
           <h3 className="text-[16px]">{title}</h3>
           <img
            src={isCollapsed ? right : down}
            alt="toggle arrow"
            className="mt-2.5 w-6 transition-transform"
          />
         
        </div>
      </div>

      {!isCollapsed && (
        <div>
          {/* Teams/Channels */}
          {channels.map((channel) => (
            <div
              key={channel._id}
              className="group flex items-center justify-between text-white bg-[#200539] px-4 py-2 cursor-pointer hover:bg-[#3D1B5F] transition-colors"
              onClick={() => {
                const userId = profile?._id || profile?.id;
                const memberIds = channel.members?.map(m => (typeof m === 'object' ? m._id || m.id : m)) || [];
                
                if (userId && memberIds.includes(userId)) {
                  onChannelSelect?.(channel._id);
                }
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <p className="text-[26px] text-[#BCBCBC]">#</p>
                <h3 className="text-[#BCBCBC] text-xl truncate">{channel.name}</h3>
              </div>
              <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
                {channel.members ? channel.members.length : 0}
              </div>
            </div>
          ))}

          {/* Members */}
          {otherMembers.map((member) => {
            const unreadCount = unreadDMs[member._id] || 0;
            return (
              <div
                key={member._id}
                className="group flex items-center justify-between text-white bg-[#200539] px-4 py-2 cursor-pointer hover:bg-[#3D1B5F] transition-colors"
                onClick={() => onStartDM?.(member._id, member.fullName)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#5C0EA4] flex items-center justify-center text-white text-sm font-semibold">
                        {member.fullName?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#200539] ${
                        member.online ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-[#BCBCBC] text-base truncate">
                      {member.fullName}
                      {member._id === profile?._id && " (You)"}
                    </h3>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
                    {unreadCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatRoomSection;
