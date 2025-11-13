import React, { useState, useEffect } from "react";
import WeekCalendar from "../dash-components/WeekCalendar";
import EventCard from "../dash-components/EventCard";

export default function UpcomingEvents() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekAnchor, setWeekAnchor] = useState(new Date());

  useEffect(() => {
    console.log("Selected date:", selectedDate.toISOString().split("T")[0]);
  }, [selectedDate]);

  return (
    <div
  className="
    w-full
    min-w-[300px]
    max-w-[400px] lg:max-w-[38vw]
    flex flex-col gap-6
    p-6 sm:p-8
    rounded-2xl gradient
    transition-all duration-300
    mx-auto lg:mx-0
  "
>
      {/* Header */}
      <h2 className="text-xl sm:text-2xl font-bold text-[#3A0A7E]">
        Upcoming Meetings
      </h2>

      {/* Week Calendar */}
      <div className="overflow-x-auto">
        <WeekCalendar
          currentDate={weekAnchor}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onWeekChange={setWeekAnchor}
        />
      </div>

      {/* Events */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        <EventCard selectedDate={selectedDate} />
      </div>
    </div>
  );
}
