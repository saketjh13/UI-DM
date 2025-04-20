import { useEffect, useState } from "react";
import axios from "axios";

const CitizenDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        setEvents(res.data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="mt-20 px-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-700">Disaster Events</h1>

      {loading && <p className="text-gray-500">Loading events...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && events.length === 0 ? (
        <p className="text-gray-600">No disaster events found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const [lat, lng] = event.location?.split(",") || [];
            return (
              <div
                key={event._id}
                className="bg-white shadow-md rounded p-4 border-l-4 border-orange-500"
              >
                <h2 className="text-lg font-semibold text-orange-700">{event.name}</h2>
                <p className="text-sm text-gray-700 mt-1">
                  📍 Location: {lat && lng ? `${lat.trim()}, ${lng.trim()}` : "Unknown"}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  🗓️ Date: {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Posted: {new Date(event.createdAt).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
