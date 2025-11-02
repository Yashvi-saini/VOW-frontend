import React, { useState } from "react";

const ManagerMeeting = () => {
  const [audience, setAudience] = useState("all");
  const [form, setForm] = useState({ title: "", dateTime: "", agenda: "" });

  const inputBase =
    "w-full h-[51px] rounded-[10px] border border-[#707070] bg-[#FEF7F6] px-4 text-[#000] placeholder:text-[#707070] focus:outline-none focus:border-[#8231CC] focus:ring-1 focus:ring-[#8231CC]";

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    console.log({ ...form, audience });
  };

  const audienceOptions = [
    { id: "all", label: "All Teams" },
    { id: "specific", label: "Specific Team(s)" },
    { id: "supervisors", label: "Team Supervisors only" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[36px] leading-[43px] font-bold text-black">
          Schedule a Meeting
        </h1>

        <button className="inline-flex items-center gap-2 bg-[#5B32AD] text-white px-4 py-2 rounded-lg hover:bg-[#29064A]">
          View Scheduled Meetings
        </button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-10 max-w-[588px]">
        {/* Title */}
        <div>
          <label className="block font-semibold text-black mb-2">
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

        {/* Audience */}
        <div>
          <label className="block font-semibold text-black mb-2">
            Select Audience
          </label>
          <div className="flex items-center justify-between w-full h-[51px] rounded-[16px] border border-[#707070] bg-[#FEF7F6] px-2">
            {audienceOptions.map((opt) => (
              <div key={opt.id} className="flex">
                <input
                  id={`aud-${opt.id}`}
                  type="radio"
                  name="audience"
                  value={opt.id}
                  checked={audience === opt.id}
                  onChange={(e) => setAudience(e.target.value)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={`aud-${opt.id}`}
                  className="cursor-pointer h-9 px-4 inline-flex items-center rounded-full text-sm transition border border-transparent text-[#707070] hover:text-[#000] peer-checked:border-[#8231CC] peer-checked:text-[#8231CC] peer-checked:bg-white"
                >
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <label className="block font-semibold text-black mb-2">
            Date & Time
          </label>
          <input
            type="datetime-local"
            name="dateTime"
            placeholder="Select Date & Time"
            className={inputBase}
            value={form.dateTime}
            onChange={onChange}
          />
        </div>

        {/* Agenda */}
        <div>
          <label className="block font-semibold text-black mb-2">
            Agenda / Description
          </label>
          <textarea
            name="agenda"
            placeholder="Add agenda or notes"
            className={`${inputBase} py-3 min-h-[96px] resize-y`}
            value={form.agenda}
            onChange={onChange}
          />
        </div>

        {/* CTA */}
        <div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#4C6FFF] text-white px-5 py-2 rounded-lg hover:bg-[#3A57E8]"
          >
            Send Invites
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManagerMeeting;
