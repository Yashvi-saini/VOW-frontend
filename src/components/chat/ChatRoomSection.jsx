import React, { useState, useEffect } from "react";
import down from "../../assets/down.svg";
import right from "../../assets/right arrow.svg";
import { getChannels } from "../../api/channelApi";
import { useSelector } from "react-redux";
import { useMembers } from "../useMembers";
import chaticon from "../../assets/chat.svg";

const ChatRoomSection = ({
  title = "Chat Room",
  activeRoomId,
  onChannelSelect,
  onStartDM,
  unreadDMs = {},
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [channels, setChannels] = useState([]);

  const { workspaceId, userId } = useSelector((state) => state.user);
  const profile = useSelector((state) => state.user.profile);
  const currentUserId = profile?._id || profile?.id || userId;
  const { members } = useMembers(workspaceId);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // ✅ CLEAN FETCH (NO TOKEN LOGIC)
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

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex items-center justify-between text-white bg-[#200539] py-2 px-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleToggleCollapse}
        >
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
          {/* Channels */}
          {channels.map((channel) => {
            const isChannelActive = String(channel._id) === String(activeRoomId);
            return (
              <div
                key={channel._id}
                className={`group flex items-center justify-between px-4 py-2 cursor-pointer transition-all ${
                  isChannelActive
                    ? "bg-[#5C0EA4] text-white font-semibold border-l-4 border-[#AC92CB]"
                    : "bg-[#200539] text-[#BCBCBC] hover:bg-[#3D1B5F]"
                }`}
                onClick={() => {
                  onChannelSelect?.(channel._id);
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-[26px]">#</p>
                  <h3 className="text-xl truncate">
                    {channel.name}
                  </h3>
                </div>

                <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
                  {channel.members ? channel.members.length : 0}
                </div>
              </div>
            );
          })}

          {/* Members */}
          {members.map((member) => {
            const memberId = member._id || member.id || member.userId;
            const unreadCount = unreadDMs[memberId] || 0;
            const isSelf = String(memberId) === String(currentUserId);
            const rawName = member.fullName || member.username || (member.email ? member.email.split("@")[0] : "User");
            const displayName = isSelf ? `${rawName} (You)` : rawName;
            const isDMActive = activeRoomId === `dm-${memberId}`;

            return (
              <div
                key={memberId}
                className={`group flex items-center justify-between px-4 py-2 cursor-pointer transition-all ${
                  isDMActive
                    ? "bg-[#5C0EA4] text-white font-semibold border-l-4 border-[#AC92CB]"
                    : "bg-[#200539] text-[#BCBCBC] hover:bg-[#3D1B5F]"
                }`}
                onClick={() =>
                  onStartDM?.(memberId, rawName)
                }
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={rawName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#5C0EA4] flex items-center justify-center text-white text-sm font-semibold">
                        {rawName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#200539] ${
                        member.online
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h3 className="text-base truncate">
                      {displayName}
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