import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/Responders/TaskCard"; // adjust path if needed

const ResponderTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem("user");
      if (!stored) {
        setError("No user found. Please log in again.");
        setLoading(false);
        return;
      }

      let storedUser;
      try {
        storedUser = JSON.parse(stored);
      } catch {
        setError("Corrupted user data. Please log in again.");
        setLoading(false);
        return;
      }

      const { teamID, token } = storedUser || {};
      if (!token || !teamID) {
        setError("Invalid credentials. Access denied.");
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(
          `http://localhost:5000/api/events/responder/${teamID}`,
          { headers }
        );

        const events = res.data || [];
        const teamTasks = [];

        events.forEach((event) => {
          if (Array.isArray(event.assignments)) {
            event.assignments.forEach((task) => {
              const isAssignedToTeam = Array.isArray(task.assignedTeams) &&
                task.assignedTeams.some(team => team.teamId === teamID);

              if (isAssignedToTeam) {
                teamTasks.push({
                  ...task,
                  eventName: event.name,
                  eventLocation: event.location,
                  eventDate: event.date,
                });
              }
            });
          }
        });

        setTasks(teamTasks);
        console.log("Filtered Team Tasks:", teamTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${taskId}/status`, {
        status: newStatus,
      });

      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update task status.");
    }
  };

  if (loading) return <p className="text-gray-500 p-6">Loading tasks...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="p-6 pt-20">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Your Assigned Tasks</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className="border border-orange-400 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              <TaskCard task={task} onStatusChange={handleStatusChange} />
            </div>
          ))
        ) : (
          <p className="text-gray-500">You have no assigned tasks right now.</p>
        )}
      </div>
    </div>
  );
};

export default ResponderTaskPage;
