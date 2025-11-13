import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMembers } from "../useMembers";
import { createTeam, createChannel } from "../../api/authApi";
import { setTeam, setSelectedTeamId, setTeamsList, mapChannelTeam, mapChannelCreator } from "./teamslices";
import useOutsideClick from "../common/useOutsideClick";
import ModalContainer from "../common/ModalContainer";
import MemberMultiSelect from "./MemberMultiSelect";
import SupervisorSelect from "./SupervisorSelect";

// moved to common/ModalContainer.jsx

export default function CreateTeamModal({ open, onClose, onChannelCreated }) {
  const dispatch = useDispatch();
  const workspaceId = useSelector((s) => s.user.workspaceId);
  const profile = useSelector((s) => s.user.profile);
  const teamsInStore = useSelector((s) => s.team?.teams || []);
  const { members, loading: membersLoading } = useMembers(workspaceId);

  const selfId = profile?._id || profile?.id || null;
  const [teamName, setTeamName] = useState("");
  // Pre-select creator in members
  const [memberIds, setMemberIds] = useState(selfId ? [selfId] : []);
  const [supervisorId, setSupervisorId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [membersOpen, setMembersOpen] = useState(false);
  const [memberQuery, setMemberQuery] = useState("");
  const membersDropdownRef = useRef(null);

  const selectableMembers = useMemo(() => members || [], [members]);
  const supervisorOptions = useMemo(() => selectableMembers.filter(m => memberIds.includes(m._id)), [selectableMembers, memberIds]);

  const toggleMember = (id) => {
    setMemberIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (supervisorId && !next.includes(supervisorId)) setSupervisorId("");
      return next;
    });
  };

  useOutsideClick(membersDropdownRef, () => setMembersOpen(false), membersOpen);

  const validate = () => {
    if (!teamName.trim()) return 'Enter a team name';
    if (memberIds.length === 0) return 'Select at least one member';
    if (!supervisorId) return 'Select a supervisor';
    if (!memberIds.includes(supervisorId)) return 'Supervisor must be a selected member';
    return null;
  };

  const handleCreate = async () => {
    setError("");
    const v = validate();
    if (v) { setError(v); return; }
    if (!workspaceId) { setError('Workspace not found'); return; }
    try {
      setSaving(true);
    // Ensure creator stays in memberIds
    const finalMemberIds = selfId && !memberIds.includes(selfId) ? [selfId, ...memberIds] : memberIds;
    const payload = { name: teamName.trim(), memberIds: finalMemberIds, superviser: supervisorId };
  const resTeam = await createTeam(workspaceId, payload);
  const team = resTeam?.data?.team || resTeam?.data;
      if (team?._id) {
        dispatch(setTeam(team));
        dispatch(setSelectedTeamId(team._id));
        dispatch(setTeamsList([team, ...teamsInStore]));
      }
  const channelPayload = { name: teamName.trim(), type: 'text', workspaceId, members: finalMemberIds };
      const resChannel = await createChannel(channelPayload);
      const channel = resChannel?.data || resChannel;
      // Pair channelId with teamId for future lookups
      if (team?._id && channel?._id) {
        dispatch(mapChannelTeam(channel._id, team._id));
        if (selfId) dispatch(mapChannelCreator(channel._id, selfId));
      }
      onChannelCreated?.(channel);
      onClose?.();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to create team');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <ModalContainer onClose={onClose}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} aria-label="Back" className="text-[#5C0EA4] text-lg">←</button>
          <h2 className="text-xl font-semibold text-black">Create New Team</h2>
          <div className="w-5" />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="w-full h-11 rounded-lg border border-[#BFA2E1] bg-[#EFE7F6] px-3 focus:outline-none"
            />
          </div>
          <MemberMultiSelect
            members={selectableMembers}
            value={memberIds}
            onChange={(next) => {
              // ensure supervisor validity when members change
              if (supervisorId && !next.includes(supervisorId)) setSupervisorId("");
              setMemberIds(next);
            }}
            loading={membersLoading}
            lockIds={selfId ? [selfId] : []}
          />
          <SupervisorSelect
            members={selectableMembers}
            selectedMemberIds={memberIds}
            value={supervisorId}
            onChange={setSupervisorId}
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="pt-1">
            <button
              onClick={handleCreate}
              disabled={saving}
              className={`px-5 py-2 rounded-lg text-white ${saving ? 'bg-[#7D629E]' : 'bg-[#5C0EA4] hover:bg-[#4A0C85]'}`}
            >
              {saving ? 'Creating…' : 'Create Team'}
            </button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}
