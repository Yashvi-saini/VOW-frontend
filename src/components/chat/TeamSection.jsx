import React, { useState, useEffect } from "react";
import down from "../../assets/down.svg";
import add from "../../assets/add.svg";
import { useMembers } from "../../components/useMembers"; // adjust path as needed
import { getChannels, getTeams, renameTeam, renameChannel } from "../../api/authApi";
import right from "../../assets/right arrow.svg"; 
import { useSelector, useDispatch } from "react-redux";
import { setSelectedTeamId, mapChannelTeam, mapChannelCreator } from "./teamslices";
import CreateTeamModal from "./CreateTeamModal.jsx";
import Toast from "../common/Toast.jsx";


const TeamSection = ({ title = "Team", onChannelSelect }) => {
  // Holds channel objects (each represents a chat channel). Team ID may differ.
  const [teams, setTeams] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'info', message: '' });
  const [loading, setLoading] = useState(false);
  const { members, fetchMembers } = useMembers();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameSaving, setRenameSaving] = useState(false);
  const handleAddClick = () => {
    setModalOpen(true);
  };
const handleToggleCollapse = () => {
  setIsCollapsed((prev) => !prev);
};
const { workspaceId, workspaceManagerId } = useSelector((state) => state.user); 
const profile = useSelector((state) => state.user.profile);
// Mapping channelId -> teamId established during team creation
const channelTeamMap = useSelector((state) => state.team.channelTeamMap);
const channelCreatorMap = useSelector((state) => state.team.channelCreatorMap);
const dispatch = useDispatch();
useEffect(() => {
  const fetchChannels = async () => {
    if (!workspaceId) return;
    try {
      console.log("Fetching channels for workspace:", workspaceId);
      const response = await getChannels(workspaceId);
      const channelList = response?.data || [];
      setTeams(channelList);
      // Attempt to backfill channel->team mapping for legacy channels
      try {
        const teamsRes = await getTeams(workspaceId);
        const teamDocs = teamsRes?.data?.teams || teamsRes?.data || [];
        const toIdArray = (arr) => (arr || []).map(m => (typeof m === 'object' ? (m._id || m.id) : m)).filter(Boolean);
        const setEq = (a, b) => {
          if (a.length !== b.length) return false;
          const sa = new Set(a);
          for (const x of b) { if (!sa.has(x)) return false; }
          return true;
        };
        channelList.forEach(ch => {
          // Skip if mapped already
          if (!ch?._id) return;
          const existing = channelTeamMap?.[ch._id];
          if (existing) return;
          const chName = ch.name;
          const chMembers = toIdArray(ch.members);
          // Candidates by name OR by exact member set
          const candidates = teamDocs.filter(td => {
            const tdMembers = toIdArray(td.members);
            const nameMatch = td.name === chName;
            const membersMatch = tdMembers.length && chMembers.length && setEq(tdMembers, chMembers);
            return nameMatch || membersMatch;
          });
          if (candidates.length === 1) {
            dispatch(mapChannelTeam(ch._id, candidates[0]._id));
          }
          // Backfill creator mapping if server returns it
          const creator = ch.creatorId || ch.ownerId || ch.createdBy || ch.creator;
          if (creator && !channelCreatorMap?.[ch._id]) {
            dispatch(mapChannelCreator(ch._id, creator));
          }
        });
      } catch (e) {
        console.warn('Backfill channel->team mapping failed', e);
      }
    } catch (err) {
      console.error("Failed to fetch channels", err);
    }
  };

  fetchChannels();
}, [workspaceId]);

  const startRename = (team) => {
    setRenamingId(team._id);
    setRenameValue(team.name || "");
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  const saveRename = async (channel) => {
    const newName = renameValue.trim();
    if (!newName || newName === channel.name) { cancelRename(); return; }
    const teamId = channelTeamMap[channel._id];
    if (!teamId) {
      setToast({ show: true, type: 'error', message: 'Team ID mapping not found for this channel.' });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
      return;
    }
    try {
      setRenameSaving(true);
      // Rename both team and channel; both must succeed
      await Promise.all([
        renameTeam(workspaceId, teamId, newName), // sends { newName }
        renameChannel(channel._id, newName),      // sends { name }
      ]);
      setTeams(prev => prev.map(c => c._id === channel._id ? { ...c, name: newName } : c));
      setToast({ show: true, type: 'success', message: 'Team renamed' });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);
      cancelRename();
    } catch (e) {
      setToast({ show: true, type: 'error', message: e?.response?.data?.message || 'Rename failed' });
      setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
    } finally {
      setRenameSaving(false);
    }
  };

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

      {/* Modal for creating team (replaces channel inline form) */}
      <CreateTeamModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onChannelCreated={(channel) => {
          if (channel?._id) {
            setTeams(prev => [...prev, channel]);
            onChannelSelect?.(channel._id);
            setToast({ show: true, type: 'success', message: 'Team & channel created.' });
            setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
          }
        }}
      />

      {/* Team List */}
{!isCollapsed &&
  teams.map((team) => (
    <div
      key={team._id}
      className="group flex items-center justify-between text-white bg-[#200539] px-4 py-2"
    >
      <div
        className="flex items-center gap-2 min-w-0 cursor-pointer"
        onClick={() => {
          if (renamingId) return; // don't navigate while renaming
          const userId = profile?._id || profile?.id;
          const memberIds = team.members?.map(m => (typeof m === 'object' ? m._id || m.id : m)) || [];
          // Allow if user is listed OR if user created the team (fallback)
          const creatorId = team.creatorId || team.ownerId || team.createdBy; // heuristic fields
          const mappedCreator = channelCreatorMap?.[team._id];
          const allowed = userId && (
            memberIds.includes(userId) ||
            (creatorId && creatorId === userId) ||
            (mappedCreator && mappedCreator === userId) ||
            (workspaceManagerId && workspaceManagerId === userId)
          );
          // Log clicker (user) and manager id for debugging access issues
          console.log('[channel click]', {
            channelId: team._id,
            userId,
            workspaceManagerId,
            creatorId,
            mappedCreator,
            isMember: memberIds.includes(userId),
            allowed
          });
          if (allowed) {
            // onChannelSelect expects a channel id; this list holds channels
            onChannelSelect?.(team._id);
            // Also push the true teamId into redux for downstream features
            const mappedTeamId = channelTeamMap?.[team._id];
            if (mappedTeamId) {
              dispatch(setSelectedTeamId(mappedTeamId));
            }
          } else {
            setToast({ show: true, type: 'error', message: 'You are not a member of this team.' });
            setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
          }
        }}
      >
        <p className="text-[26px] text-[#BCBCBC]">#</p>
        {renamingId === team._id ? (
          <div className="flex items-center gap-2">
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="px-2 py-1 rounded bg-white text-[#111827] text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); saveRename(team); }
                if (e.key === 'Escape') { e.preventDefault(); cancelRename(); }
              }}
              autoFocus
            />
            <button
              className="px-2 py-1 rounded bg-[#10B981] text-white text-xs disabled:opacity-60"
              onClick={() => saveRename(team)}
              disabled={renameSaving}
            >Save</button>
            <button
              className="px-2 py-1 rounded bg-[#EF4444] text-white text-xs"
              onClick={cancelRename}
            >Cancel</button>
          </div>
        ) : (
          <h3 className="text-[#BCBCBC] text-xl truncate">{team.name}</h3>
        )}
      </div>
      {renamingId !== team._id ? (
        <div className="flex items-center gap-2">
          <button
            className="hidden group-hover:inline-flex items-center justify-center w-7 h-7 rounded bg-white text-[#200539]"
            onClick={() => startRename(team)}
            title="Rename team"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712z" />
              <path d="M17.443 7.557L6.5 18.5 5 19l.5-1.5 10.943-10.943 1.157 1.157z" />
            </svg>
          </button>
          <div className="bg-[#BFA2E1] text-[#0E1219] px-2 rounded-md font-medium text-[16px]">
            {team.members ? team.members.length : 0}
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  ))}
      <Toast show={toast.show} type={toast.type} message={toast.message} />
    </div>
  );
};

export default TeamSection;