import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EventDashboard = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) return <p>Loading event dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{event.name} - Dashboard</h2>
      <p className="text-gray-600">{event.date} | {event.location}</p>

      {/* Teams Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Assigned Teams</h3>
        {event.teams.length > 0 ? (
          <ul className="mt-2">
            {event.teams.map(team => (
              <li key={team._id} className="bg-white p-3 rounded-md shadow-md mt-2 flex justify-between">
                <div>
                  <p><strong>Name:</strong> {team.name}</p>
                  <p><strong>Captain:</strong> {team.captain}</p>
                </div>
                <button className="text-red-500 hover:underline">Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No teams assigned.</p>
        )}
      </div>

      {/* Resources Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Resources Used</h3>
        {event.resources.length > 0 ? (
          <ul className="mt-2">
            {event.resources.map(resource => (
              <li key={resource._id} className="bg-white p-3 rounded-md shadow-md mt-2 flex justify-between">
                <div>
                  <p><strong>Name:</strong> {resource.name}</p>
                  <p><strong>Quantity:</strong> {resource.quantity}</p>
                </div>
                <button className="text-red-500 hover:underline">Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No resources used.</p>
        )}
      </div>

      {/* Tasks Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Task Progress</h3>
        {event.tasks.length > 0 ? (
          <ul className="mt-2">
            {event.tasks.map(task => (
              <li key={task._id} className="bg-white p-3 rounded-md shadow-md mt-2 flex justify-between">
                <div>
                  <p><strong>Task:</strong> {task.name}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                </div>
                <button className="text-blue-500 hover:underline">Update</button>
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

export default EventDashboard;
