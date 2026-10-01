import React, { useEffect, useState } from "react";
import { getAllMeetings } from "../../../api/meetingApi";

const MeetingCards = ({ selectedDate }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await getAllMeetings();
        const raw = res?.data?.meetings ?? res?.data ?? res?.meetings ?? [];
        const list = Array.isArray(raw) ? raw : (Array.isArray(raw?.meetings) ? raw.meetings : []);
        setMeetings(list);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const toLocalDateString = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const now = new Date();

  const filteredMeetings = selectedDate
    ? meetings.filter((m) => {
        const start = new Date(m.startTime);
        return toLocalDateString(start) === toLocalDateString(selectedDate);
      })
    : meetings.filter((m) => new Date(m.endTime) > now);

  if (loading) return <p className="p-4 text-gray-500">Loading meetings...</p>;
  if (filteredMeetings.length === 0)
    return <p className="p-4 text-gray-500">NO MEETINGS</p>;

  return (
    <div className="max-h-[250px] w-full overflow-y-auto m-4 mx-0 mb-2 space-y-4 hide-scrollbar">
      {filteredMeetings.map((meeting, index) => {
        const bgColor =
          index % 2 === 0 ? "bg-[#5C0EA4] text-white" : "bg-[#E8E9EB] text-black";

        const start = new Date(meeting.startTime);
        const end = new Date(meeting.endTime);

        const formatTime = (date) => {
          if (isNaN(date.getTime())) return "N/A";
          return date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        };

        const timeRange = `${formatTime(start)} – ${formatTime(end)}`;

        return (
          <div
            key={meeting._id || meeting.id || index}
            className={`rounded-2xl ${bgColor} p-3 border border-gray-200`}
          >
            <h2 className="text-lg font-semibold">{meeting.title}</h2>
            <p className="text-sm">{timeRange}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MeetingCards;