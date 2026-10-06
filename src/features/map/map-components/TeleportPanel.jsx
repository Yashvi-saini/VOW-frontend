import React, { useMemo, useState } from "react";
import { ZONES, zoneAt } from "../mapLayout";

// Lists places and people in the office; picking one teleports you there.
const TeleportPanel = ({ avatars, onTeleport, onClose }) => {
  const [tab, setTab] = useState("people");

  const people = useMemo(
    () =>
      Object.values(avatars || {})
        .filter((a) => a && a.userId)
        .map((a) => {
          const x = a.targetX ?? a.x;
          const y = a.targetY ?? a.y;
          return {
            userId: a.userId,
            name: a.displayName || "User",
            x,
            y,
            where: zoneAt(x, y)?.label || "Open floor",
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    [avatars]
  );

  const tabBtn = (id, label) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`flex-1 py-1.5 text-sm rounded-md transition ${
        tab === id ? "bg-[#5C0EA4] text-white" : "bg-[#EFE7F6] text-[#450B7B] hover:bg-[#E3D5F1]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="absolute top-4 right-4 z-40 w-72 rounded-xl bg-white shadow-xl border border-[#CCB4E3] p-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-[#450B7B]">Teleport</h3>
        <button type="button" onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-black text-lg leading-none">
          ×
        </button>
      </div>
      <div className="flex gap-2 mb-2">
        {tabBtn("people", `People (${people.length})`)}
        {tabBtn("places", "Places")}
      </div>

      <div className="max-h-72 overflow-y-auto pr-1">
        {tab === "people" &&
          (people.length === 0 ? (
            <p className="text-sm text-gray-500 py-3 text-center">Nobody else is in the office right now.</p>
          ) : (
            people.map((p) => (
              <button
                key={p.userId}
                type="button"
                onClick={() => onTeleport({ x: p.x, y: p.y, nearUser: true })}
                className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg hover:bg-[#F3ECFA] text-left"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <i className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm text-gray-800 truncate">{p.name}</span>
                    <span className="block text-[11px] text-gray-500 truncate">{p.where}</span>
                  </span>
                </span>
                <span className="text-xs text-[#5C0EA4] font-medium shrink-0">Go</span>
              </button>
            ))
          ))}

        {tab === "places" &&
          ZONES.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => onTeleport({ x: z.center.x, y: z.center.y })}
              className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg hover:bg-[#F3ECFA] text-left"
            >
              <span className="flex items-center gap-2 min-w-0">
                <i className="inline-block w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: z.color }} />
                <span className="text-sm text-gray-800 truncate">{z.label}</span>
              </span>
              <span className="text-xs text-[#5C0EA4] font-medium shrink-0">Go</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default TeleportPanel;
