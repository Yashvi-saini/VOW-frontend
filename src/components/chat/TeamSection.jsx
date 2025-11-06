import React, { useState,useEffect } from "react";
import down from "../../assets/down.svg";
import add from "../../assets/add.svg";
import { useMembers } from "../../components/useMembers"; // adjust path as needed
import { getChannels, createChannel } from "../../api/authApi";
import right from "../../assets/right arrow.svg"; 
 import { useSelector } from "react-redux";


const TeamSection = ({ title = "Team", onChannelSelect }) => {
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { members, fetchMembers } = useMembers();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleAddClick = () => {
    setShowForm((prev) => !prev);
    setError("");
  };
const handleToggleCollapse = () => {
  setIsCollapsed((prev) => !prev);
};
const { workspaceId, workspaceToken } = useSelector((state) => state.user); 
  const handleCreateChannel = async (e) => {
  e.preventDefault();
  if (!channelName.trim()) return;

  setLoading(true);
  setError("");

  await fetchMembers(); // fetch latest members

  const payload = {
    name: channelName,
    type: "text",
    workspaceId,
    members: members.map((m) => m._id),
  };

  try {
    console.log("Creating channel with payload:", payload);
    const response = await createChannel(payload);
    const newChannel = response?.data || response;
    console.debug("createChannel response:", response);


    const createdId =
      newChannel?._id || newChannel?.id || newChannel?.data?._id || newChannel?.channel?._id;

    setTeams((prev) => [...prev, newChannel]);


    if (onChannelSelect && createdId) {
      console.debug("Notifying parent of new channel id:", createdId);
      onChannelSelect(createdId);
    } else {
      console.warn("Could not determine created channel id from response", newChannel);
    }
    setChannelName("");
    setShowForm(false);
  } catch (err) {
    setError("Failed to create channel");
    console.error("Channel creation failed", err);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const fetchChannels = async () => {
    if (!workspaceId) return;
    try {
      console.log("Fetching channels for workspace:", workspaceId);
      const response = await getChannels(workspaceId);
      const channelList = response?.data || [];
      setTeams(channelList);
    } catch (err) {
      console.error("Failed to fetch channels", err);
    }
  };

  fetchChannels();
}, [workspaceId]);

  return (
    <div className="mt-4">
      {/* Section Header */}
      {/* Section Header */}
<div className="flex items-center justify-between text-white bg-[#200539] py-2 px-4">
  <div className="flex items-center gap-2 cursor-pointer" onClick={handleToggleCollapse}>
    <img
      src={isCollapsed ? right : down}
      alt="toggle arrow"
      className="mt-2.5 w-6 transition-transform"
    />
    <h3 className="text-xl">{title}</h3>
  </div>
  <img
    src={add}
    alt="add icon"
    className="cursor-pointer"
    onClick={handleAddClick}
  />
</div>

      {/* Add Channel Form */}
      {showForm && (
        <form
          onSubmit={handleCreateChannel}
          className="bg-[#200539] p-4 flex flex-col gap-3"
        >
          <label className="text-white text-sm font-medium">
            Channel Name
          </label>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="e.g. general"
            className="px-3 py-2 rounded bg-[#2F0A5C] text-white placeholder-gray-400"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#BFA2E1] text-[#0E1219] px-4 py-2 rounded font-medium ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Channel"}
          </button>
        </form>
      )}

      {/* Team List */}
{!isCollapsed &&
  teams.map((team) => (
    <div
      key={team._id}
      className="flex items-center justify-between text-white bg-[#200539] px-4 py-2 cursor-pointer"
      onClick={() => onChannelSelect && onChannelSelect(team._id)}
    >
      <div className="flex items-center gap-2">
        <p className="text-[26px] text-[#BCBCBC]">#</p>
        <h3 className="text-[#BCBCBC] text-xl">{team.name}</h3>
      </div>
      <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
        {team.members ? team.members.length : 0}
      </div>
    </div>
  ))}
    </div>
  );
};

export default TeamSection;