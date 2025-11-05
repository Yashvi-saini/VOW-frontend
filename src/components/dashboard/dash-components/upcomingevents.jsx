// App.jsx
import WeekCalendar from '../dash-components/WeekCalendar';
import EventCard from '../dash-components/EventCard.jsx';
const sampleEvents = [
  {
    title: 'Event Title',
    date: '2025-10-31',
    time: '09:00–09:45 AM IST',
    urgency: 'non-urgent',
  },
  {
    title: 'Event Title',
    date: '2025-10-31',
    time: '09:00–09:45 AM IST',
    urgency: 'urgent',
  },
];

function UpcomingEvents() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
      <WeekCalendar events={sampleEvents} />
      <EventCard event={sampleEvents[0]} />
    </div>
  );
}

export default UpcomingEvents;