import React, { useState, useEffect } from "react";
import WeekCalendar from "../dash-components/WeekCalendar";
import EventCard from "../dash-components/EventCard";

export default function UpcomingEvents() {
  const [selectedDate, setSelectedDate] = useState(new Date());
 const [weekAnchor, setWeekAnchor] = React.useState(new Date()); 
  useEffect(() => {
    console.log("Selected date:", selectedDate.toISOString().split("T")[0]);
  }, [selectedDate]);

  return (
    <div className=" w-[590px] p-4 bg-[radial-gradient(circle_at_center,_rgba(239,230,246,1)_40%,_rgba(225,208,238,0.9)_70%)] rounded-2xl ">
      <h2 className="text-2xl font-bold mb-4">Upcoming Meetings</h2>
      <WeekCalendar
      currentDate={weekAnchor}
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
      onWeekChange={setWeekAnchor}
    />

      <EventCard selectedDate={selectedDate} />
    </div>
  );
}