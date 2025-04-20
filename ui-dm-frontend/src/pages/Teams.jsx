import { useState, useEffect } from "react";
import axios from "axios";
import CreateTeamModal from "../components/Teams/CreateTeamModal";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/teams");
      setTeams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setError("Failed to load teams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Teams</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Create Team
        </button>
      </div>

      {/* Team List */}
      {loading ? (
        <p className="text-gray-500">Loading teams...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {teams.map(({ _id, name, type, captain, location, members }) => (
            <div key={_id} className="bg-white p-4 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p><strong>Type:</strong> {type}</p>
                <p><strong>Captain:</strong> {captain}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Members:</strong> {members?.length || 0}</p>
              </div>
              <button className="mt-2 text-blue-500 hover:underline">View Details</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No teams available</p>
      )}

      {/* Create Team Modal */}
      {showModal && (
        <CreateTeamModal 
          onClose={() => setShowModal(false)} 
          onTeamCreated={() => {
            fetchTeams();  // Re-fetch teams after creating a new one
            setShowModal(false);  // Close the modal after creation
          }} 
        />
      )}
    </div>
  );
};

export default Teams;
