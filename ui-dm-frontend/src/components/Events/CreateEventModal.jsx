import { useState, useEffect } from "react";
import axios from "axios";

const CreateEventModal = ({ onClose, onEventCreated }) => {
  const [teams, setTeams] = useState([]);
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    date: "",
    teams: [],
    resources: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamsAndResources = async () => {
      try {
        setLoading(true);
        const [teamsRes, resourcesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/teams?status=benched"), // Only benched teams
          axios.get("http://localhost:5000/api/resources"),
        ]);
        setTeams(teamsRes.data);
        setResources(resourcesRes.data);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndResources();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { name, options } = e.target;
    setFormData({
      ...formData,
      [name]: Array.from(options).filter((opt) => opt.selected).map((opt) => opt.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/events", formData);
      onEventCreated(); // Refresh event list
      onClose(); // Close modal
    } catch (err) {
      setError("Failed to create event.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-lg rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
          <h3 className="text-lg font-semibold">Create Event</h3>
          <button onClick={onClose} className="text-xl">✖</button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-center">Loading teams and resources...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Name */}
              <div>
                <label className="block font-semibold">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1 h-20"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block font-semibold">Event Date</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mt-1"
                  required
                />
              </div>

              {/* Teams Selection */}
              <div>
                <label className="block font-semibold">Assign Teams</label>
                <select
                  multiple
                  name="teams"
                  value={formData.teams}
                  onChange={handleSelectChange}
                  className="w-full border rounded p-2 mt-1"
                >
                  {teams.length > 0 ? (
                    teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name} ({team.type})
                      </option>
                    ))
                  ) : (
                    <option disabled>No benched teams available</option>
                  )}
                </select>
              </div>

              {/* Resources Selection */}
              <div>
                <label className="block font-semibold">Assign Resources (Optional)</label>
                <select
                  multiple
                  name="resources"
                  value={formData.resources}
                  onChange={handleSelectChange}
                  className="w-full border rounded p-2 mt-1"
                >
                  {resources.length > 0 ? (
                    resources.map((resource) => (
                      <option key={resource._id} value={resource._id}>
                        {resource.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No resources available</option>
                  )}
                </select>
                <p className="text-sm text-gray-500">Resources are optional but recommended.</p>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create Event
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
