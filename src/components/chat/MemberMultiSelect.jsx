import React, { useState, useMemo, useRef } from "react";
import useOutsideClick from "../common/useOutsideClick";

export default function MemberMultiSelect({
  members = [],
  value = [],
  onChange,
  loading = false,
  label = "Select Members",
  lockIds = [], // ids that must remain selected (e.g., creator)
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false), open);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(m => (m.fullName || m.username || "").toLowerCase().includes(q));
  }, [members, query]);

  const isLocked = (id) => lockIds.includes(id);
  const toggle = (id) => {
    if (isLocked(id)) return; // do not allow removing locked ids
    const next = value.includes(id) ? value.filter(x => x !== id) : [...value, id];
    onChange?.(next);
  };

  const clearAll = () => {
    onChange?.([]);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-black mb-1">{label}</label>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full h-11 rounded-lg border border-[#BFA2E1] bg-[#EFE7F6] px-3 flex items-center justify-between"
        >
          <div className="flex flex-wrap gap-1 items-center text-[#111827]">
            {value.length === 0 && <span className="text-[#707070]">Select members</span>}
            {value.slice(0,3).map(id => {
              const mm = members.find(x => x._id === id);
              return <span key={id} className="text-xs bg-[#5C0EA4] text-white px-2 py-1 rounded">{(mm?.fullName || mm?.username || id).slice(0,16)}</span>;
            })}
            {value.length > 3 && <span className="text-xs text-[#5C0EA4]">+{value.length - 3} more</span>}
          </div>
          <svg className={`w-4 h-4 text-[#5C0EA4] transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
          </svg>
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-[#E5E7EB] bg-white shadow-lg">
            <div className="p-2 border-b border-[#F3F4F6]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search members"
                className="w-full h-9 rounded-md border border-[#E5E7EB] px-2 text-sm"
              />
            </div>
            <div className="max-h-56 overflow-y-auto">
              {loading && <div className="p-3 text-sm">Loading members…</div>}
              {!loading && filtered.map(m => {
                const selected = value.includes(m._id);
                const locked = isLocked(m._id);
                return (
                  <button
                    type="button"
                    key={m._id}
                    onClick={() => toggle(m._id)}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${selected ? 'bg-violet-50' : ''} ${locked ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    <span className="truncate pr-2">{m.fullName || m.username || m._id}</span>
                    {selected && (
                      <svg className="w-4 h-4 text-[#5C0EA4]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
              {!loading && filtered.length === 0 && <div className="p-3 text-sm">No members found.</div>}
            </div>
            <div className="p-2 border-t border-[#F3F4F6] flex items-center justify-between text-xs">
              <span className="text-[#6B7280]">{value.length} selected</span>
              <button type="button" onClick={clearAll} className="text-[#5C0EA4]">Clear</button>
            </div>
          </div>
        )}
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map(id => {
            const mm = members.find(x => x._id === id);
            const locked = isLocked(id);
            return <span key={id} className={`text-xs bg-[#5C0EA4] text-white px-2 py-1 rounded ${locked ? 'opacity-90' : ''}`}>{(mm?.fullName || mm?.username || id).slice(0,20)}{locked ? ' (you)' : ''}</span>;
          })}
        </div>
      )}
    </div>
  );
}
