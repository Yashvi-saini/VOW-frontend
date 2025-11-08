import React, { useState, useEffect } from "react";
import CalendarPopover from "./CalendarPopover";
import { useMembers } from "../../useMembers";
import { useSelector, useDispatch } from "react-redux";
import { createTeam, assignTeamLead, getTeams, scheduleMeeting } from "../../../api/authApi";
import { setTeam, setTeamsList, setSelectedTeamId } from "../../chat/teamslices";

const MeetingForm = ({ role }) => {
  // Force single audience option: "specific-teams"
  const audienceOptions = [{ id: "specific-teams", label: "Select Teams" }];
  const [audience, setAudience] = useState("specific-teams");
  const [form, setForm] = useState({ title: "", dateTime: "", agenda: "" });
  const dispatch = useDispatch();
  const workspaceId = useSelector(s => s.user.workspaceId);
  const { members, loading: membersLoading, error: membersError } = useMembers(workspaceId);
  // UI mode: create-team | select-team
  const [mode, setMode] = useState("select-team");
  const [teamMembers, setTeamMembers] = useState([]); // selected member objects (create mode)
  const [supervisorId, setSupervisorId] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const teams = useSelector(s => s.team.teams);
  const selectedTeamId = useSelector(s => s.team.selectedTeamId);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [meetingSaving, setMeetingSaving] = useState(false);
  const [isConference, setIsConference] = useState(false);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarState, setCalendarState] = useState(null);

  const inputBase =
    "w-full h-[51px] rounded-[10px] border border-[#BFA2E1] bg-[#EFE7F6] px-4 text-[#000] placeholder:text-[#707070] focus:outline-none focus:border-[#8231CC] focus:ring-1 focus:ring-[#8231CC]";

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleMember = (m) => {
    setTeamMembers(prev => prev.some(x => x._id === m._id) ? prev.filter(x => x._id !== m._id) : [...prev, m]);
  };

  const handleMemberDoubleClick = (m) => {
    setSupervisorId(m._id);
    setFeedback(`Supervisor set: ${m.fullName || m.username || m._id}`);
  };

  const refreshTeams = async () => {
    if (!workspaceId) return;
    try {
      setLoadingTeams(true);
      const res = await getTeams(workspaceId);
      const list = res?.data?.teams || res?.data || [];
      dispatch(setTeamsList(list));
    } catch (e) {
      console.warn("Failed to load teams", e);
    } finally {
      setLoadingTeams(false);
    }
  };

  useEffect(() => { refreshTeams(); }, [workspaceId]);

  const createTeamFlow = async () => {
    if (!workspaceId) {
      setFeedback("Workspace ID missing.");
      return;
    }
    if (!teamName.trim()) {
      setFeedback("Enter a team name.");
      return;
    }
    if (teamMembers.length === 0) {
      setFeedback("Select at least one member.");
      return;
    }
    if (!supervisorId) {
      setFeedback("Double-click a member to set supervisor before creating.");
      return;
    }
    try {
      setCreating(true); setFeedback("");
      const payload = {
        name: teamName.trim(),
        memberIds: teamMembers.map(m => m._id),
        superviser: supervisorId,
      };
      const res = await createTeam(workspaceId, payload);
      const team = res?.data?.team;
      if (res?.data?.success && team?._id) {
        dispatch(setTeam(team));
        // Add new team to list and select it
        dispatch(setTeamsList([team, ...teams]));
        dispatch(setSelectedTeamId(team._id));
        setFeedback("Team created. Assigning supervisor...");
        try {
          await assignTeamLead(workspaceId, team._id, supervisorId);
          setFeedback("Team and supervisor assigned successfully.");
        } catch (e) {
          console.warn("Supervisor assignment failed", e);
          setFeedback("Team created but supervisor assignment failed.");
        }
        // Keep selection & name visible or clear? We'll clear create form but keep new team selected.
        setTeamName("");
        setTeamMembers([]);
        setSupervisorId(null);
        setMode("select-team");
      } else {
        setFeedback(res?.data?.message || "Failed to create team.");
      }
    } catch (err) {
      setFeedback("Error creating team. Try again.");
    } finally {
      setCreating(false);
    }
  };

  const buildDateTimes = () => {
    if (!calendarState?.date) return { startTime: null, endTime: null };
    const baseDate = calendarState.date;
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const day = baseDate.getDate();
    const to24 = (h, mer) => {
      let hour = parseInt(h, 10);
      if (mer === 'PM' && hour !== 12) hour += 12;
      if (mer === 'AM' && hour === 12) hour = 0;
      return hour;
    };
    if (calendarState.mode === 'range') {
      const sh = to24(calendarState.range.sh, calendarState.range.smer);
      const eh = to24(calendarState.range.eh, calendarState.range.emer);
      const sm = parseInt(calendarState.range.sm, 10);
      const em = parseInt(calendarState.range.em, 10);
      const start = new Date(year, month, day, sh, sm, 0);
      const end = new Date(year, month, day, eh, em, 0);
      return { startTime: start.toISOString(), endTime: end.toISOString() };
    }
    if (calendarState.mode === 'time') {
      const hour = to24(calendarState.time.h, calendarState.time.mer);
      const minute = parseInt(calendarState.time.m, 10);
      const start = new Date(year, month, day, hour, minute, 0);
      // default 1 hour
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return { startTime: start.toISOString(), endTime: end.toISOString() };
    }
    // all day
    const startDay = new Date(year, month, day, 0, 0, 0);
    const endDay = new Date(year, month, day, 23, 59, 59);
    return { startTime: startDay.toISOString(), endTime: endDay.toISOString() };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");
    if (!workspaceId) { setFeedback("Workspace ID missing"); return; }
    if (!form.title.trim()) { setFeedback("Enter meeting title"); return; }
    if (!calendarState) { setFeedback("Select date & time"); return; }
    const { startTime, endTime } = buildDateTimes();
    if (!startTime || !endTime) { setFeedback("Invalid date/time selection"); return; }
    if (!isConference && !selectedTeamId) { setFeedback("Select a team or mark as conference"); return; }
    // Console detailed date/time info
    try {
      const startLocal = new Date(startTime);
      const endLocal = new Date(endTime);
      console.log('[meeting] Scheduling meeting with times', {
        start_iso: startTime,
        end_iso: endTime,
        start_local: startLocal.toString(),
        end_local: endLocal.toString(),
        conference: isConference,
        selectedTeamId,
        calendarMode: calendarState?.mode,
        rawCalendar: calendarState,
      });
    } catch (logErr) {
      console.warn('[meeting] Failed logging meeting times', logErr);
    }
    const body = {
      title: form.title.trim(),
      description: form.agenda || "",
      startTime,
      endTime,
      teamId: isConference ? undefined : selectedTeamId,
      isConference,
    };
    try {
      setMeetingSaving(true);
      const res = await scheduleMeeting(workspaceId, body);
      if (res?.data?.success) {
        setFeedback("Meeting scheduled successfully.");
        // Optionally reset form
        // setForm({ title: "", dateTime: "", agenda: "" });
      } else {
        setFeedback(res?.data?.message || "Failed to schedule meeting.");
      }
    } catch (err) {
      setFeedback("Error scheduling meeting.");
    } finally {
      setMeetingSaving(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[36px] leading-[43px] font-bold text-black">
          Schedule a Meeting
        </h1>

        
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-10 max-w-[588px]">
        {/* Title */}
        <div>
          <label className="block font-semibold text-black mb-2 text-[24px]">
            Meeting Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Give your meeting a clear name"
            className={inputBase}
            value={form.title}
            onChange={onChange}
          />
        </div>

        {/* Audience Mode: create/select teams and conference toggle */}
        <div className="border border-[#BFA2E1] rounded-2xl bg-[#EFE7F6] p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-black">Teams</h2>
            <div className="flex items-center gap-2 text-[11px]">
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConference}
                  onChange={(e) => setIsConference(e.target.checked)}
                  className="accent-[#5C0EA4]"
                />
                <span className="text-[#5C0EA4] font-medium">Conference (all workspace)</span>
              </label>
            </div>
          </div>
          {!isConference && (
            <>
              <div className="inline-flex rounded-full bg-white p-1 self-start shadow-sm border border-[#D6C5E9]">
                {['select-team','create-team'].map(mo => (
                  <button
                    key={mo}
                    type="button"
                    onClick={() => { setMode(mo); setFeedback(''); }}
                    className={`px-4 py-1.5 text-sm rounded-full transition-colors ${mode===mo ? 'bg-[#5C0EA4] text-white' : 'text-[#5C0EA4] hover:bg-[#E9DFF6]'}`}
                  >
                    {mo === 'select-team' ? 'Select Team' : 'Create Team'}
                  </button>
                ))}
              </div>
              {mode === 'create-team' && (
                <>
                  <div>
                    <label className="block font-semibold text-black mb-2">Team Name</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter team name"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-black">Members</h3>
                      <button
                        type="button"
                        onClick={() => setShowMemberPicker(s => !s)}
                        className="text-xs bg-[#5C0EA4] text-white px-3 py-1 rounded hover:bg-[#4A0C85]"
                      >{showMemberPicker ? 'Hide' : 'Show'} Member List</button>
                    </div>
                    {showMemberPicker && (
                      <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                        {membersLoading && <p className="text-sm">Loading members...</p>}
                        {membersError && <p className="text-sm text-red-600">Failed to load members.</p>}
                        {!membersLoading && !membersError && members.map(m => {
                          const selected = teamMembers.some(x => x._id === m._id);
                          const isSupervisor = supervisorId === m._id;
                          return (
                            <div
                              key={m._id}
                              onClick={() => toggleMember(m)}
                              onDoubleClick={() => handleMemberDoubleClick(m)}
                              className={`flex items-center justify-between cursor-pointer px-3 py-1 rounded text-sm border ${selected ? 'bg-white border-[#5C0EA4]' : 'bg-[#E6D9F3] border-transparent'} hover:bg-white transition`}
                              title={isSupervisor ? 'Supervisor' : 'Click to select; double-click to set supervisor'}
                            >
                              <span className="truncate">{m.fullName || m.username || m._id}</span>
                              <div className="flex items-center gap-2">
                                {isSupervisor && <span className="text-[10px] text-white bg-[#5C0EA4] px-2 py-0.5 rounded">Supervisor</span>}
                                {selected && !isSupervisor && <span className="text-[10px] text-[#5C0EA4]">Selected</span>}
                              </div>
                            </div>
                          );
                        })}
                        {(!membersLoading && members.length === 0) && <p className="text-sm">No members in workspace.</p>}
                      </div>
                    )}
                    <p className="text-[11px] text-[#707070] mt-1">Double-click a member to set as supervisor.</p>
                    {supervisorId && <p className="text-[11px] text-[#5C0EA4] mt-1">Supervisor selected.</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {teamMembers.map(m => (
                      <span key={m._id} className="text-[11px] bg-[#5C0EA4] text-white px-2 py-1 rounded">
                        {(m.fullName || m.username || m._id).slice(0,20)}{supervisorId===m._id?' (Lead)':''}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={creating}
                      onClick={createTeamFlow}
                      className={`px-5 py-2 rounded-lg text-white text-sm font-medium ${creating ? 'bg-[#7D629E]' : 'bg-[#5C0EA4] hover:bg-[#4A0C85]'}`}
                    >
                      {creating ? 'Creating...' : 'Create Team'}
                    </button>
                    {feedback && <span className="text-xs text-[#5C0EA4]">{feedback}</span>}
                  </div>
                </>
              )}
              {mode === 'select-team' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-black">Select a Team</h3>
                    <button type="button" onClick={refreshTeams} className="text-[10px] px-2 py-1 rounded bg-white border border-[#D6C5E9] hover:bg-[#F3EEF9]">Refresh</button>
                  </div>
                  {loadingTeams && <p className="text-sm">Loading teams...</p>}
                  {!loadingTeams && teams.length === 0 && <p className="text-sm">No teams created yet.</p>}
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {teams.map(t => (
                      <div
                        key={t._id}
                        onClick={() => dispatch(setSelectedTeamId(t._id))}
                        className={`px-3 py-2 rounded cursor-pointer text-sm border ${selectedTeamId===t._id ? 'bg-[#5C0EA4] text-white border-[#5C0EA4]' : 'bg-[#E6D9F3] text-[#2D2940] border-transparent hover:bg-white'}`}
                        title={t.name}
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate max-w-[200px]">{t.name}</span>
                          {selectedTeamId===t._id && <span className="text-[10px] font-medium">Selected</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedTeamId && (
                    <p className="text-[11px] text-[#5C0EA4]">Selected team: {teams.find(x => x._id===selectedTeamId)?.name}</p>
                  )}
                </div>
              )}
            </>
          )}
          {isConference && <p className="text-[11px] text-[#5C0EA4]">Conference mode: meeting for all workspace members.</p>}
        </div>

        {/* Date & Time */}
        <div className="relative">
          <label className="block font-semibold text-black text-[24px] mb-2">
            Date & Time
          </label>
          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className={`${inputBase} text-left`}
          >
            {form.dateTime || "Select Date & Time"}
          </button>

          <CalendarPopover
            open={calendarOpen}
            initial={calendarState ?? undefined}
            onClose={() => setCalendarOpen(false)}
            onDone={(state) => {
              setCalendarState(state);
              setForm((f) => ({ ...f, dateTime: state.label }));
              // Log the raw selection and friendly label
              try {
                const date = state?.date;
                console.log('[meeting] Calendar selection', {
                  label: state?.label,
                  mode: state?.mode,
                  date_string: date ? date.toString() : null,
                  date_iso: date && typeof date.toISOString === 'function' ? date.toISOString() : null,
                  time: state?.time,
                  range: state?.range,
                });
              } catch (e) {
                console.warn('[meeting] Failed to log calendar selection', e);
              }
              setCalendarOpen(false);
            }}
          />
        </div>

        {/* Agenda */}
        <div>
          <label className="block font-semibold text-black text-[24px] mb-2">
            Agenda / Description
          </label>
          <textarea
            name="agenda"
            placeholder="Add agenda or notes"
            className={`${inputBase} py-3 min-h-24 resize-y`}
            value={form.agenda}
            onChange={onChange}
          />
        </div>

        {/* Meeting submit (independent of team creation) */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            type="submit"
            disabled={meetingSaving}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white ${meetingSaving ? 'bg-[#7A91D6]' : 'bg-[#4C6FFF] hover:bg-[#3A57E8]'}`}
          >
            {meetingSaving ? 'Saving...' : 'Save Meeting'}
          </button>
          {feedback && <span className="text-[11px] text-[#5C0EA4]">{feedback}</span>}
        </div>
      </form>
    </div>
  );
};

export default MeetingForm;
