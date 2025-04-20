import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CreateEvent = () => {
  const location = useLocation();
  const { reports = [], alertData = [] } = location.state || {};

  const [eventData, setEventData] = useState({
    name: "",
    intensity: "",
    citizenDescriptions: [],
    citizenPhotos: [],
    location: "",
  });

  const [tasks, setTasks] = useState([
    {
      taskName: "",
      description: "",
      assignedTeams: [],
      assignedResources: [],
      deploymentLocation: "",
      photos: [],
    },
  ]);

  const [availableTeams, setAvailableTeams] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);

  // Pre-fill event data from reports
  useEffect(() => {
    if (reports.length > 0) {
      const avgIntensity =
        reports.reduce((sum, r) => sum + Number(r.intensity || 0), 0) / reports.length;

      const descriptions = reports.map((r) => r.description);
      const photos = reports.flatMap((r) => r.mediaUrls || []);
      const centerLocation = {
        lat:
          reports.reduce((sum, r) => sum + parseFloat(r.location?.lat || r.latitude), 0) /
          reports.length,
        lng:
          reports.reduce((sum, r) => sum + parseFloat(r.location?.lon || r.longitude), 0) /
          reports.length,
      };

      setEventData((prev) => ({
        ...prev,
        name: reports[0]?.disasterType || "",
        intensity: avgIntensity.toFixed(1),
        citizenDescriptions: descriptions,
        citizenPhotos: photos,
        location: `${centerLocation.lat}, ${centerLocation.lng}`,
      }));
    }
  }, [reports]);

  // Fetch teams and resources
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, resourceRes] = await Promise.all([
          axios.get("http://localhost:5000/api/teams"),
          axios.get("http://localhost:5000/api/resources"),
        ]);

        setAvailableTeams(teamRes.data);
        setAvailableResources(resourceRes.data);
      } catch (err) {
        console.error("Failed to fetch teams/resources", err);
      }
    };

    fetchData();
  }, []);

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...eventData,
      assignments: tasks,
      reports: reports.map((r) => r._id),
    };
    console.log("Payload being sent:", {
      payload
    });
    
    
    try {
      const res = await axios.post("http://localhost:5000/api/events", payload);
      console.log("Event created:", res.data);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Something went wrong!");
    }
  };

  

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Create New Event</h1>

      {/* Reports Overview */}
      {reports.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Included Alerts ({reports.length})
          </h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {reports.map((report) => (
              <li key={report._id} className="p-3 border rounded bg-white shadow-sm">
                <p><strong>Type:</strong> {report.disasterType}</p>
                <p><strong>Intensity:</strong> {report.intensity}</p>
                <p><strong>Description:</strong> {report.description}</p>
                <p><strong>Coordinates:</strong> {report.latitude}, {report.longitude}</p>
                {report.sender && (
                  <p><strong>Sender:</strong> {report.sender.name} ({report.sender.email})</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Disaster Name</label>
            <input
              type="text"
              name="name"
              value={eventData.name}
              onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g. Flood in Downtown"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Average Intensity</label>
            <input
              type="number"
              name="intensity"
              value={eventData.intensity}
              onChange={(e) => setEventData({ ...eventData, intensity: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              step="0.1"
              min="0"
              max="10"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location (Center)</label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Auto-filled from reports"
            required
          />
        </div>

        {/* Tasks Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Assign Tasks</h2>
          {tasks.map((task, index) => (
            <div key={index} className="border p-4 rounded mb-4 bg-gray-50 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Task Name"
                  value={task.taskName}
                  onChange={(e) => handleTaskChange(index, "taskName", e.target.value)}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Deployment Location"
                  value={task.deploymentLocation}
                  onChange={(e) => handleTaskChange(index, "deploymentLocation", e.target.value)}
                  className="p-2 border rounded"
                />
              </div>

              <textarea
                placeholder="Task Description"
                value={task.description}
                onChange={(e) => handleTaskChange(index, "description", e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              />

              {/* Assign Team */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Assign Team</label>
                <select
                  multiple
                  value={task.assignedTeams}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                    handleTaskChange(index, "assignedTeams", selected);
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                >
                  {availableTeams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name} (ID: {team.teamId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign Resources */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Assign Resources</label>
                <select
                  multiple
                  value={task.assignedResources}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                    handleTaskChange(index, "assignedResources", selected);
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                >
                  {availableResources.map((res) => (
                    <option key={res._id} value={res._id}>
                      {res.name} (Qty: {res.quantity})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setTasks([
                ...tasks,
                {
                  taskName: "",
                  description: "",
                  assignedTeams: [],
                  assignedResources: [],
                  deploymentLocation: "",
                  photos: [],
                },
              ])
            }
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add Task
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 w-full sm:w-auto"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
