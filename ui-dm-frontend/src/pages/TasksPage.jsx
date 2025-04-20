import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="flex h-screen pt-20 p-4 bg-gray-100 overflow-y-auto">
        <div className="flex-1">
          <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6">All Tasks</h1>

            {loading ? (
              <p className="text-gray-500">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-gray-500">No tasks available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <div key={task._id} className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-2">{task.taskName}</h2>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Description:</strong> {task.description || "—"}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Assigned Teams:</strong>{" "}
                      {task.assignedTeams?.map((team) => team.name).join(", ") || "—"}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Resources:</strong>{" "}
                      {task.assignedResources?.length > 0 ? (
                        <ul className="list-disc ml-5">
                          {task.assignedResources.map((res, idx) => (
                            <li key={idx}>
                              {res.item} ({res.type}) — {res.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "—"
                      )}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Location:</strong>{" "}
                      {task.deploymentLocation
                        ? `Lat: ${task.deploymentLocation.lat}, Lng: ${task.deploymentLocation.lng}`
                        : "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TasksPage;
