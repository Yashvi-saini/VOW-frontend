import React, { useState } from "react";
import {useMembers} from "../useMembers"; 
import { createTeam } from "../../api/authApi";
import { useSelector } from "react-redux";

const TeamBuilder = () => {
 const workspaceId = useSelector((state) => state.user.workspaceId); 
const workspaceToken = useSelector((state) => state.user.workspaceToken);
 console.log("Workspace ID:", workspaceId);
 console.log("Workspace Token:", workspaceToken);
  const { members, loading, error } = useMembers(workspaceId); 
  const [selectedIds, setSelectedIds] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [creating, setCreating] = useState(false);
  const [serverMsg, setServerMsg] = useState("");
    
const fullUserState = useSelector((state) => state.user);
console.log("Redux user state:", fullUserState);
  const toggleMember = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim() || selectedIds.length === 0) {
      setServerMsg("Please enter a team name and select members.");
      return;
    }

    try {
      setCreating(true);
      setServerMsg("");
      const payload = {
        name: teamName.trim(),
        memberIds: selectedIds,
        superviser: null,
      };
      const res = await createTeam(workspaceId, payload);
      if (res.data?.success) {
        setServerMsg("Team created successfully!");
        setSelectedIds([]);
        setTeamName("");
      } else {
        setServerMsg(res.data?.msg || "Failed to create team.");
      }
    } catch (err) {
      setServerMsg("Error creating team. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p>Loading members...</p>;
  if (error) return <p>Error fetching members.</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create a Team</h2>

      <input
        type="text"
        placeholder="Team name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      <div className="space-y-2 mb-4">
        {members.map((member) => (
          <label key={member._id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedIds.includes(member._id)}
              onChange={() => toggleMember(member._id)}
            />
            <span>{member.fullName || member.username}</span>
          </label>
        ))}
      </div>

      <button
        onClick={handleCreateTeam}
        disabled={creating}
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
      >
        {creating ? "Creating..." : "Create Team"}
      </button>

      {serverMsg && <p className="mt-3 text-sm text-red-500">{serverMsg}</p>}
    </div>
  );
};

export default TeamBuilder;