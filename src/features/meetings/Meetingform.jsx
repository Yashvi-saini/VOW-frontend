import React, { useState, useEffect, useRef } from "react";
import CalendarPopover from "./CalendarPopover";
import { useSelector, useDispatch } from "react-redux";
import { getTeams } from "@/api/teamApi";
import { scheduleMeeting } from "@/api/meetingApi";
import { setSelectedTeamId, setTeamsList } from "@/components/chat/teamslices";

const MeetingForm = ({ role, onSuccess, onClose }) => {
  const audienceOptions = [{ id: "specific-teams", label: "Select Teams" }];
  const [audience, setAudience] = useState("specific-teams");
  const [form, setForm] = useState({ title: "", dateTime: "", agenda: "" });
  const dispatch = useDispatch();
  const reduxWsId = useSelector((s) => s.user?.workspaceId);
  const workspaceId = reduxWsId || localStorage.getItem("workspaceId");
  const [feedback, setFeedback] = useState("");
  const teams = useSelector((s) => s.team?.teams || []);
  const selectedTeamId = useSelector((s) => s.team?.selectedTeamId);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [meetingSaving, setMeetingSaving] = useState(false);
  const [isConference, setIsConference] = useState(false);
  const agendaRef = useRef(null);
  const [titleError, setTitleError] = useState("");
  const [agendaError, setAgendaError] = useState("");

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarState, setCalendarState] = useState(null);

  const inputBase =
    "w-full h-[3.1875rem] rounded-[0.625rem] border border-[#BFA2E1] bg-[#EFE7F6] px-4 text-[#000] placeholder:text-[#707070] focus:outline-none focus:border-[#8231CC] focus:ring-1 focus:ring-[#8231CC]";

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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

  useEffect(() => {
    refreshTeams();
  }, [workspaceId]);

  useEffect(() => {
    if (agendaRef.current) {
      agendaRef.current.style.height = "auto";
      agendaRef.current.style.height = `${Math.min(agendaRef.current.scrollHeight, 160)}px`;
    }
  }, [form.agenda]);

  const buildDateTimes = () => {
    if (!calendarState?.date) return { startTime: null, endTime: null };
    const baseDate = calendarState.date;
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const day = baseDate.getDate();
    const pad = (n) => String(n).padStart(2, "0");
    const toLocalOffsetISO = (d) => {
      const y = d.getFullYear();
      const mo = pad(d.getMonth() + 1);
      const da = pad(d.getDate());
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      const ss = pad(d.getSeconds());
      const tzMin = -d.getTimezoneOffset();
      const sign = tzMin >= 0 ? "+" : "-";
      const abs = Math.abs(tzMin);
      const tzh = pad(Math.floor(abs / 60));
      const tzm = pad(abs % 60);
      return `${y}-${mo}-${da}T${hh}:${mm}:${ss}${sign}${tzh}:${tzm}`;
    };
    const to24 = (h, mer) => {
      let hour = parseInt(h, 10);
      if (mer === "PM" && hour !== 12) hour += 12;
      if (mer === "AM" && hour === 12) hour = 0;
      return hour;
    };
    if (calendarState.mode === "range") {
      const sh = to24(calendarState.range.sh, calendarState.range.smer);
      const eh = to24(calendarState.range.eh, calendarState.range.emer);
      const sm = parseInt(calendarState.range.sm, 10);
      const em = parseInt(calendarState.range.em, 10);
      const start = new Date(year, month, day, sh, sm, 0);
      const end = new Date(year, month, day, eh, em, 0);
      return { startTime: toLocalOffsetISO(start), endTime: toLocalOffsetISO(end) };
    }
    if (calendarState.mode === "time") {
      const hour = to24(calendarState.time.h, calendarState.time.mer);
      const minute = parseInt(calendarState.time.m, 10);
      const start = new Date(year, month, day, hour, minute, 0);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return { startTime: toLocalOffsetISO(start), endTime: toLocalOffsetISO(end) };
    }
    const startDay = new Date(year, month, day, 0, 0, 0);
    const endDay = new Date(year, month, day, 23, 59, 59);
    return { startTime: toLocalOffsetISO(startDay), endTime: toLocalOffsetISO(endDay) };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");
    setTitleError("");
    setAgendaError("");
    if (!workspaceId) {
      return setFeedback("Workspace ID missing");
    }
    if (!form.title.trim()) {
      return setFeedback("Enter meeting title");
    }
    if (!calendarState) {
      return setFeedback("Select date & time");
    }
    if (form.title.trim().length < 4) {
      setTitleError("Minimum 4 characters required.");
      return;
    }
    if (form.title.trim().length > 50) {
      setTitleError("Maximum 50 characters allowed.");
      return;
    }
    if (form.agenda.trim().length < 10) {
      setAgendaError("Minimum 10 characters required.");
      return;
    }

    const { startTime, endTime } = buildDateTimes();
    if (!startTime || !endTime) {
      return setFeedback("Invalid date/time selection");
    }
    if (!isConference && !selectedTeamId) {
      return setFeedback("Select a team or mark as conference");
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
        setTimeout(() => {
          onSuccess?.();
        }, 700);
      } else {
        setFeedback(res?.data?.msg || res?.data?.message || "Failed to schedule meeting.");
      }
    } catch (err) {
      const backendMsg =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        err?.message;
      setFeedback(backendMsg || "Error scheduling meeting.");
    } finally {
      setTimeout(() => {
        setMeetingSaving(false);
      }, 1000);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] leading-tight font-bold text-black">
          Schedule a Meeting
        </h1>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-3xl font-bold p-1 leading-none cursor-pointer"
            title="Close"
          >
            &times;
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6 sm:gap-8 lg:gap-10 max-w-full sm:max-w-[36.75rem] pb-8">
        <div>
          <label className="block font-semibold text-black mb-2 text-lg sm:text-xl lg:text-[1.5rem]">
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
          {titleError && (
            <p className="text-red-600 text-sm mt-1">{titleError}</p>
          )}
        </div>

        <div className="border border-[#BFA2E1] rounded-2xl bg-[#EFE7F6] p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-black">Teams</h2>
            <div className="flex items-center gap-2 text-[0.6875rem]">
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConference}
                  onChange={(e) => setIsConference(e.target.checked)}
                  className="accent-[#5C0EA4]"
                />
                <span className="text-[#5C0EA4] font-medium text-[0.9375rem]">Conference (all workspace)</span>
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
                <button
                  type="button"
                  onClick={refreshTeams}
                  className="text-[0.625rem] px-2 py-1 rounded bg-white border border-[#D6C5E9] hover:bg-[#F3EEF9]"
                >
                  Refresh
                </button>
              </div>
              {loadingTeams && <p className="text-sm">Loading teams...</p>}
              {!loadingTeams && teams.length === 0 && (
                <p className="text-sm text-gray-500">
                  No teams created yet. Check "Conference (all workspace)" to invite all members.
                </p>
              )}
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {teams.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => dispatch(setSelectedTeamId(t._id))}
                    className={`px-3 py-2 rounded cursor-pointer text-sm border ${
                      selectedTeamId === t._id
                        ? "bg-[#5C0EA4] text-white border-[#5C0EA4]"
                        : "bg-[#E6D9F3] text-[#2D2940] border-transparent hover:bg-white"
                    }`}
                    title={t.name}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate max-w-[12.5rem]">{t.name}</span>
                      {selectedTeamId === t._id && <span className="text-[0.625rem] font-medium">Selected</span>}
                    </div>
                  </div>
                ))}
              </div>
              {selectedTeamId && (
                <p className="text-[0.875rem] text-[#5C0EA4]">
                  Selected team: {teams.find((x) => x._id === selectedTeamId)?.name}
                </p>
              )}
            </div>
          )}
          {isConference && (
            <p className="text-[0.875rem] text-[#5C0EA4]">Conference mode: meeting for all workspace members.</p>
          )}
        </div>

        <div className="relative">
          <label className="block font-semibold text-black text-lg sm:text-xl lg:text-[1.5rem] mb-2">
            Date & Time
          </label>

          <button
            type="button"
            onClick={() => setCalendarOpen(true)}
            className={`${inputBase} text-left cursor-pointer`}
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
              setCalendarOpen(false);
            }}
          />
        </div>

        <div>
          <label className="block font-semibold text-black text-lg sm:text-xl lg:text-[1.5rem] mb-2">
            Agenda / Description
          </label>
          <textarea
            name="agenda"
            placeholder="Add agenda or notes (minimum 10 characters)"
            className={`${inputBase} w-full px-2.5 py-2 border-none rounded-md outline-none resize-none overflow-y-auto hide-scrollbar max-h-40`}
            value={form.agenda}
            onChange={onChange}
            ref={agendaRef}
          />
          {agendaError ? (
            <p className="text-red-600 text-sm mt-1">{agendaError}</p>
          ) : (
            <p className="text-sm mt-1 opacity-0">{" "}</p>
          )}
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            type="submit"
            disabled={meetingSaving}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-colors cursor-pointer ${
              meetingSaving ? "bg-[#7A91D6] cursor-not-allowed" : "bg-[#4C6FFF] hover:bg-[#3A57E8]"
            }`}
          >
            {meetingSaving ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Meeting"
            )}
          </button>
          {feedback && <span className="text-[1rem] text-[#5C0EA4] font-medium">{feedback}</span>}
        </div>
      </form>
    </div>
  );
};

export default MeetingForm;

