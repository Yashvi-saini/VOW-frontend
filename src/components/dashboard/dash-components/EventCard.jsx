import React, { useEffect, useState } from "react";
import { getAllMeetings } from "../../../api/authApi";

const MeetingCards = ({ selectedDate }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await getAllMeetings();
        setMeetings(res.data.meetings || []);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    if (selectedDate) {
      console.log("Filtering meetings for:", formatDate(selectedDate));
    }
  }, [selectedDate]);

  const now = new Date();

  const filteredMeetings = selectedDate
    ? meetings.filter((m) => {
        const start = new Date(m.startTime);
        const end = new Date(m.endTime);

        // Match selected date AND ensure meeting hasn't ended yet
        return (
          formatDate(start) === formatDate(selectedDate) &&
          end > now
        );
      })
    : meetings.filter((m) => new Date(m.endTime) > now); // if no date selected, show only upcoming

  console.log("Filtered meetings:", filteredMeetings);

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

        const formatTime = (date) =>
          date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          });

        const timeRange = `${formatTime(start)} – ${formatTime(end)} (IST)`;

        return (
          <div
            key={meeting._id}
            className={`rounded-2xl  ${bgColor} p-3 border border-gray-200`}
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