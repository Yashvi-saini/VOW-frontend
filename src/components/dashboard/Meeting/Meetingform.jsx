import React, { useState, useEffect, useRef } from "react";
import CalendarPopover from "./CalendarPopover";
import { useSelector, useDispatch } from "react-redux";
import { getTeams, scheduleMeeting } from "../../../api/authApi";
import { setSelectedTeamId, setTeamsList } from "../../chat/teamslices";

const MeetingForm = ({ role }) => {
  // Force single audience option: "specific-teams"
  const audienceOptions = [{ id: "specific-teams", label: "Select Teams" }];
  const [audience, setAudience] = useState("specific-teams");
  const [form, setForm] = useState({ title: "", dateTime: "", agenda: "" });
  const dispatch = useDispatch();
  const workspaceId = useSelector(s => s.user.workspaceId);
  // members not needed here; team selection only
  // Only select-team now (create moved to chat modal)
  const [feedback, setFeedback] = useState("");
  const teams = useSelector(s => s.team.teams);
  const selectedTeamId = useSelector(s => s.team.selectedTeamId);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [meetingSaving, setMeetingSaving] = useState(false);
  const [isConference, setIsConference] = useState(false);
  const agendaRef = useRef(null);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarState, setCalendarState] = useState(null);

  const inputBase =
    "w-full h-[51px] rounded-[10px] border border-[#BFA2E1] bg-[#EFE7F6] px-4 text-[#000] placeholder:text-[#707070] focus:outline-none focus:border-[#8231CC] focus:ring-1 focus:ring-[#8231CC]";

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Removed local team creation handlers

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

  // Auto-resize agenda textarea similar to chat input (max 160px)
  useEffect(() => {
    if (agendaRef.current) {
      agendaRef.current.style.height = "auto";
      agendaRef.current.style.height = `${Math.min(agendaRef.current.scrollHeight, 160)}px`;
    }
  }, [form.agenda]);

  // Removed createTeamFlow; creation handled in chat modal

  // Build ISO strings preserving the user's local wall-clock time with timezone offset
  // Example (IST): 2025-11-11 07:00 -> "2025-11-11T07:00:00+05:30"
  const buildDateTimes = () => {
    if (!calendarState?.date) return { startTime: null, endTime: null };
    const baseDate = calendarState.date;
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const day = baseDate.getDate();
    const pad = (n) => String(n).padStart(2, '0');
    const toLocalOffsetISO = (d) => {
      const y = d.getFullYear();
      const mo = pad(d.getMonth() + 1);
      const da = pad(d.getDate());
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      const ss = pad(d.getSeconds());
      const tzMin = -d.getTimezoneOffset(); // minutes east of UTC
      const sign = tzMin >= 0 ? '+' : '-';
      const abs = Math.abs(tzMin);
      const tzh = pad(Math.floor(abs / 60));
      const tzm = pad(abs % 60);
      return `${y}-${mo}-${da}T${hh}:${mm}:${ss}${sign}${tzh}:${tzm}`;
    };
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
      return { startTime: toLocalOffsetISO(start), endTime: toLocalOffsetISO(end) };
    }
    if (calendarState.mode === 'time') {
      const hour = to24(calendarState.time.h, calendarState.time.mer);
      const minute = parseInt(calendarState.time.m, 10);
      const start = new Date(year, month, day, hour, minute, 0);
      // default 1 hour
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return { startTime: toLocalOffsetISO(start), endTime: toLocalOffsetISO(end) };
    }
    // all day
    const startDay = new Date(year, month, day, 0, 0, 0);
    const endDay = new Date(year, month, day, 23, 59, 59);
    return { startTime: toLocalOffsetISO(startDay), endTime: toLocalOffsetISO(endDay) };
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
        start_sent: startTime,
        end_sent: endTime,
        parsed_start_local: startLocal.toString(),
        parsed_end_local: endLocal.toString(),
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

  // Renaming UI is intentionally not available in Meeting form.

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

        {/* Audience: select existing team or conference */}
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
            <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3
                      className="font-semibold text-black cursor-pointer select-none"
                      title="Click to load latest teams"
                      onClick={refreshTeams}
                    >
                      Select a Team
                    </h3>
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
            className={`${inputBase} w-full px-2.5 py-2 border-none rounded-md outline-none resize-none overflow-y-auto hide-scrollbar max-h-40`}
            value={form.agenda}
            onChange={onChange}
            ref={agendaRef}
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
