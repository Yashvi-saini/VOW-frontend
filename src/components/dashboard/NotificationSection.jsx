import React from "react";
import nonotification from "../../assets/notofication.svg"; 
import filterIcon from "../../assets/Filter.svg";
import downIcon from "../../assets/down.svg";

const Pill = ({ children, onClick, icon, caret }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border border-[#AC92CB] bg-white  text-[#AC92CB]"
  >
    {icon ? <img src={icon} alt="" className="h-4 w-4" /> : null}
    <span>{children}</span>
    {caret ? <img src={downIcon} alt="" className="h-3 w-3 opacity-70" /> : null}
  </button>
);

const TableHeader = () => (
  <div className="w-full grid grid-cols-4 gap-4 px-5 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wide bg-white border-b ">
    <div>notification</div>
    <div>Type</div>
    <div>Time</div>
    <div>Status</div>
  </div>
);

const EmptyState = ({ onBack }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <img src={nonotification} alt="No notifications" className="h-80 w-auto mb-6 select-none" />
    <button
      onClick={onBack || (() => window.history.back())}
      className="px-5 py-2.5 rounded-lg bg-[#5E9BFF] text-white text-sm hover:bg-[#4E8BEF] focus:outline-none focus:ring-2 focus:ring-[#5E9BFF]/30"
    >
      Back to Dashboard
    </button>
  </div>
);


const NotificationSection = () => {
  const [query, setQuery] = React.useState("");
 
  const filtered = React.useMemo(() => [], []);

  return (
    <div className="relative z-10">
      <div className="w-full flex items-center justify-between gap-3 mb-6">
        <div className="relative w-full max-w-[740px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for notification"
            className="w-full border border-[#AC92CB] rounded-2xl pl-10 pr-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5E9BFF]/20"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-[#9CA3AF]"
            fill="none"
           
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>
        <div className="flex items-center gap-2  ">
          <Pill icon={filterIcon} caret >Filter</Pill>
          <Pill>Mark all as Read</Pill>
        </div>
      </div>

      {/* Table area with header + empty state */}
      <div className="w-full rounded-2xl bg-white  overflow-hidden">
        <TableHeader />
        <EmptyState />
      </div>
    </div>
  );
};

export default NotificationSection;
