import { useEffect, useState } from "react";
import axios from "axios";

const TeamList = ({ activeView }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await axios.get("/api/teams");
        setTeams(data);
      } catch (err) {
        setError("Failed to load teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Separate teams into active and benched based on status
  const activeTeams = teams.filter((team) => team.status === "active");
  const benchedTeams = teams.filter((team) => team.status === "benched");

  const teamsToShow = activeView === "active" ? activeTeams : benchedTeams;

  return (
    <div className="grid grid-cols-1 gap-4">
      {loading ? (
        <p className="text-gray-500">Loading teams...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : teamsToShow.length > 0 ? (
        teamsToShow.map((team) => (
          <div key={team._id} className="bg-white p-4 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Type:</strong> {team.type}</p>
              <p><strong>Captain:</strong> {team.captain}</p>
              <p><strong>Members:</strong> {team.members.length}</p>
              <p><strong>Location:</strong> {team.location}</p>
            </div>
            <button className="mt-2 text-blue-500 hover:underline">View Details</button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No teams available</p>
      )}
    </div>
  );
};

export default TeamList;
