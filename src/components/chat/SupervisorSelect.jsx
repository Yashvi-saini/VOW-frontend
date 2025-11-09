import React from "react";

export default function SupervisorSelect({ members = [], selectedMemberIds = [], value, onChange }) {
  const options = members.filter(m => selectedMemberIds.includes(m._id));
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-1">Supervisor</label>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-11 rounded-lg border border-[#BFA2E1] bg-[#EFE7F6] px-3 focus:outline-none"
      >
        <option value="" disabled>Select supervisor</option>
        {options.map(m => (
          <option key={m._id} value={m._id}>{m.fullName || m.username || m._id}</option>
        ))}
      </select>
      <p className="text-[11px] text-[#707070] mt-1">Supervisor must be among selected members.</p>
    </div>
  );
}
