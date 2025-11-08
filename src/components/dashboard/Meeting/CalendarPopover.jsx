import React, { useMemo, useState } from "react";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const week = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const pad2 = (n) => String(n).padStart(2, "0");

function TimeField({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={1}
        max={12}
        value={value.h}
        onChange={(e) =>
          set("h", pad2(Math.min(12, Math.max(1, +e.target.value || 1))))
        }
        className="w-16 h-10 rounded-[12px] border border-[#E5E7EB] px-2 text-center text-sm"
      />
      <span className="text-lg text-gray-500">:</span>
      <input
        type="number"
        min={0}
        max={59}
        value={value.m}
        onChange={(e) =>
          set("m", pad2(Math.min(59, Math.max(0, +e.target.value || 0))))
        }
        className="w-16 h-10 rounded-[12px] border border-[#E5E7EB] px-2 text-center text-sm"
      />
      <div className="inline-flex rounded-[12px] overflow-hidden border border-[#E5E7EB] bg-white">
        {["AM", "PM"].map((m) => (
          <button
            key={m}
            onClick={() => set("mer", m)}
            className={`px-3 py-2 text-sm transition-colors ${
              value.mer === m
                ? "bg-[#6D28D9] text-white"
                : "text-[#374151] hover:bg-gray-50"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CalendarPopover({ open, onClose, onDone, initial }) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(initial?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial?.month ?? today.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    initial?.date ? new Date(initial.date) : null
  );
  const [mode, setMode] = useState(initial?.mode ?? "time"); // all | time | range
  const [time, setTime] = useState(initial?.time ?? { h: "07", m: "00", mer: "AM" });
  const [range, setRange] = useState(
    initial?.range ?? { sh: "07", sm: "00", smer: "AM", eh: "09", em: "00", emer: "AM" }
  );

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const gotoPrev = () => {
    const m = viewMonth - 1;
    if (m < 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth(m);
  };
  const gotoNext = () => {
    const m = viewMonth + 1;
    if (m > 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth(m);
  };

  const gotoToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  const label = () => {
    if (!selectedDate) return "Select Date & Time";
    const d = `${monthNames[selectedDate.getMonth()].slice(0, 3)} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    const hourClean = (h) => {
      // Accept strings like "01" "1" and ensure no leading zero for display
      const n = parseInt(h, 10);
      return isNaN(n) ? h : String(n);
    };
    const minClean = (m) => {
      const n = parseInt(m, 10);
      if (isNaN(n)) return "00"; // default to 00
      return String(n).padStart(2, "0");
    };
    if (mode === "all") return `${d} - All day`;
    if (mode === "time") {
      return `${d} at ${hourClean(time.h)}:${minClean(time.m)} ${time.mer}`;
    }
    // range
    return `${d}, ${hourClean(range.sh)}:${minClean(range.sm)} ${range.smer} - ${hourClean(range.eh)}:${minClean(range.em)} ${range.emer}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute right-10 top-28 w-[360px] rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-sm text-[#111827] font-medium">Select date:</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedDate(null)} className="text-xs text-red-500">
              Clear
            </button>
            <button
              onClick={gotoToday}
              className="text-xs rounded-[8px] border border-[#E5E7EB] px-2 py-1 hover:bg-gray-50"
            >
              Today
            </button>
            <button onClick={onClose} className="text-xl leading-none px-1">×</button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-medium text-[#111827]">{viewYear}</div>
          <div className="flex items-center gap-2">
            <button onClick={gotoPrev} className="rounded-[8px] border border-[#E5E7EB] px-2 py-1 text-sm hover:bg-gray-50">‹</button>
            <div className="text-sm">{monthNames[viewMonth]}</div>
            <button onClick={gotoNext} className="rounded-[8px] border border-[#E5E7EB] px-2 py-1 text-sm hover:bg-gray-50">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 px-4 text-center text-[11px] text-[#6B7280]">
          {week.map((w) => (
            <div key={w} className="py-1">{w}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 px-4 pb-3">
          {cells.map((d, i) => {
            const isToday =
              d &&
              d.getFullYear() === today.getFullYear() &&
              d.getMonth() === today.getMonth() &&
              d.getDate() === today.getDate();
            const selected = isSameDay(d, selectedDate);

            return (
              <button
                key={i}
                disabled={!d}
                onClick={() => d && setSelectedDate(d)}
                className={[
                  "h-9 rounded-[12px] text-sm transition-colors",
                  d ? "hover:bg-violet-50" : "cursor-default",
                  selected ? "bg-[#6D28D9] text-white hover:bg-[#6D28D9]" : "",
                  isToday && !selected ? "ring-1 ring-[#6D28D9]/60" : "",
                ].join(" ")}
              >
                {d ? d.getDate() : ""}
              </button>
            );
          })}
        </div>

        <div className="px-4 pb-4">
          <div className="text-sm text-[#111827] mb-2">Select time:</div>

          <div className="inline-flex rounded-full bg-[#F3F4F6] p-1 mb-3">
            {[
              { id: "all", label: "All day" },
              { id: "time", label: "Time" },
              { id: "range", label: "Range" },
            ].map((seg) => (
              <button
                key={seg.id}
                onClick={() => setMode(seg.id)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  seg.id === mode ? "bg-[#6D28D9] text-white" : "text-[#6B7280] hover:bg-white"
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>

          {mode === "time" && (
            <div className="flex items-center gap-2">
              <TimeField value={time} onChange={setTime} />
            </div>
          )}

          {mode === "range" && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="text-xs text-gray-600 mb-1">Start</div>
                <TimeField
                  value={{ h: range.sh, m: range.sm, mer: range.smer }}
                  onChange={(v) =>
                    setRange((r) => ({ ...r, sh: v.h, sm: v.m, smer: v.mer }))
                  }
                />
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-gray-600 mb-1">End</div>
                <TimeField
                  value={{ h: range.eh, m: range.em, mer: range.emer }}
                  onChange={(v) =>
                    setRange((r) => ({ ...r, eh: v.h, em: v.m, emer: v.mer }))
                  }
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="rounded-[12px] border border-[#E5E7EB] px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                onDone({
                  year: viewYear,
                  month: viewMonth,
                  date: selectedDate,
                  mode,
                  time,
                  range,
                  label: label(),
                })
              }
              className="rounded-[12px] bg-[#6D28D9] text-white px-5 py-2 hover:bg-[#5B21B6]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
