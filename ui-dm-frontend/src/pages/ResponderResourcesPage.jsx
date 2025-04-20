import React, { useEffect, useState } from "react";
import axios from "axios";
import ResourceCard from "../components/Responders/ResourceCard"; // update the path as needed
import { Link } from "react-router-dom";
const ResponderResourcesPage = () => {
  const [teamId, setTeamId] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Grab teamID from localStorage
  useEffect(() => {
    const init = () => {
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

      const { teamID, role } = storedUser || {};
      if (!teamID || role !== "responder") {
        setError("Invalid credentials. Access denied.");
        setLoading(false);
        return;
      }

      setTeamId(teamID);
    };

    init();
  }, []);

  // Fetch resources from assigned tasks
  useEffect(() => {
    const fetchResources = async () => {
      if (!teamId) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/responder/${teamId}`);
        const data = res.data || [];

        const allResources = data.flatMap(event =>
          event.assignments
            .filter(a => a.assignedTeamId === teamId)
            .flatMap(a => a.assignedResources || [])
        );

        // Deduplicate by resource ID
        const uniqueResourcesMap = {};
        allResources.forEach(res => {
          uniqueResourcesMap[res._id] = res;
        });

        setResources(Object.values(uniqueResourcesMap));
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [teamId]);

  if (loading) return <p className="p-4 text-gray-500">Loading resources...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!resources.length) return <p className="p-4 text-blue-500">No resources assigned yet.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Assigned Resources</h1>
<Link to="/responder/request-resource">
  <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
    Request New Resource
  </button>
</Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <ResourceCard key={res._id} resource={res} showRequestButton={true} />
        ))}
      </div>
    </div>
  );
};

export default ResponderResourcesPage;
