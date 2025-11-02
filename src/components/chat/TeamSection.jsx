import React, { useState } from "react";
import down from "../../assets/down.svg";
import add from "../../assets/add.svg";
import { createChannel } from "../../api/authApi"; // rename from `channels` to `createChannel` for clarity
import { useMembers } from "../../components/useMembers"; // adjust path as needed

 

const TeamSection = ({ title = "Team", onChannelSelect }) => {
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { members, fetchMembers } = useMembers();
  const workspaceId = localStorage.getItem("workspaceId");
  const handleAddClick = () => {
    setShowForm((prev) => !prev);
    setError("");
  };

  const handleCreateChannel = async (e) => {
  e.preventDefault();
  if (!channelName.trim()) return;

  setLoading(true);
  setError("");

  const workspaceId = localStorage.getItem("workspaceId");
  await fetchMembers(); // fetch latest members

  const payload = {
    name: channelName,
    type: "text",
    workspaceId,
    members: members.map((m) => m._id),
  };

  try {
    const response = await createChannel(payload);
    // some backends return the created resource at response.data, others at response.data.data
    const newChannel = response?.data || response;
    console.debug("createChannel response:", response);

    // try to locate an id in several common shapes
    const createdId =
      newChannel?._id || newChannel?.id || newChannel?.data?._id || newChannel?.channel?._id;

    // push the whole object into local teams list for rendering
    setTeams((prev) => [...prev, newChannel]);

    // notify parent/chat about the newly created channel id so it can become active
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

  return (
    <div className="mt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between text-white bg-[#200539] py-2 px-4">
        <div className="flex items-center gap-2">
          <img src={down} alt="down arrow" className="mt-2.5 w-6" />
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
      {teams.map((team) => (
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