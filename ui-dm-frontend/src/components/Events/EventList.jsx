import { Link } from "react-router-dom";

const EventList = ({ events }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {events.map((event) => (
        <div key={event._id} className="bg-white p-4 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
          <p className="text-gray-600">{event.date} | {event.location}</p>
          <Link to={`/events/${event._id}/dashboard`} className="mt-2 text-blue-500 hover:underline">
            View Dashboard
          </Link>
        </div>
      ))}
    </div>
  );
};

export default EventList;
