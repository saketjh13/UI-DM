import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEvent(data);
      } catch (err) {
        console.error("Error loading event details:", err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) return <p className="p-6 text-gray-500">Loading event details...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!event) return <p className="p-6 text-gray-500">Event not found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-orange-600">{event.name}</h2>
      <p className="text-gray-600 mt-1">
        {new Date(event.date).toLocaleDateString()} | {event.location}
      </p>
      <p className="mt-3 text-gray-700">{event.description}</p>

      {/* Assigned Teams */}
      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-2">Assigned Teams</h3>
        {event?.teams?.length > 0 ? (
          <ul className="space-y-3">
            {event.teams.map((team) => (
              <li key={team._id} className="bg-white p-4 rounded-md shadow border border-gray-200">
                <p><strong>Name:</strong> {team.name}</p>
                <p><strong>Captain:</strong> {team.captain}</p>
                <p><strong>Status:</strong> {team.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No teams assigned.</p>
        )}
      </div>

      {/* Assigned Resources */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-2">Resources Used</h3>
        {event?.resources?.length > 0 ? (
          <ul className="space-y-3">
            {event.resources.map((resource) => (
              <li key={resource._id} className="bg-white p-4 rounded-md shadow border border-gray-200">
                <p><strong>Name:</strong> {resource.name}</p>
                <p><strong>Quantity:</strong> {resource.quantity}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No resources used.</p>
        )}
      </div>

      {/* Task Progress */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-2">Task Progress</h3>
        {event?.tasks?.length > 0 ? (
          <ul className="space-y-3">
            {event.tasks.map((task) => (
              <li key={task._id} className="bg-white p-4 rounded-md shadow border border-gray-200">
                <p><strong>Task:</strong> {task.name}</p>
                <p><strong>Status:</strong> {task.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tasks assigned.</p>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
