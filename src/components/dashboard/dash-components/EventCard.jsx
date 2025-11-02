// EventCard.jsx
export default function EventCard({ event }) {
  const bgColor = event.urgency === 'urgent' ? 'bg-gray-200' : 'bg-purple-500 text-white';

  return (
    <div className={`rounded-md p-2 mb-2 ${bgColor}`}>
      <div className="text-xs font-bold capitalize">{event.urgency}</div>
      <div className="text-sm">{event.title}</div>
      <div className="text-xs">{event.time}</div>
    </div>
  );
}