import { useState, useEffect } from "react";
import axios from "axios";
import CreateEventModal from "../components/Events/CreateEventModal";
import { useUser } from "../context/UserContext";

const Events = () => {
  const { userRole } = useUser(); // Admin, Responder, Citizen
  const [events, setEvents] = useState([]);
  const [activeView, setActiveView] = useState("active");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`http://localhost:5000/api/events`);
      const data = res.data;

      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([]);
        console.warn("Unexpected event data:", data);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeView]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-orange-600">Events</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveView("active")}
            className={`px-4 py-2 rounded ${activeView === "active" ? "bg-orange-500 text-white" : "bg-gray-300 text-black"}`}
          >
            Active Events
          </button>
          <button
            onClick={() => setActiveView("archived")}
            className={`px-4 py-2 rounded ${activeView === "archived" ? "bg-orange-500 text-white" : "bg-gray-300 text-black"}`}
          >
            Archived Events
          </button>
          {userRole === "Admin" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create Event
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading events...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
                <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Description:</strong> {event.description}</p>
                <button
                  className="mt-2 text-blue-500 hover:underline"
                  onClick={() => window.location.href = `/events/${event._id}`}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No events available</p>
        )}
      </div>

      {showModal && userRole === "Admin" && (
        <CreateEventModal
          onClose={() => setShowModal(false)}
          onEventCreated={fetchEvents}
        />
      )}
    </div>
  );
};

export default Events;
