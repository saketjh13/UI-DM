import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResponderAssignedAlertsPage = () => {
  const [teamId, setTeamId] = useState(null);
  const [assignedAlerts, setAssignedAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchAssignedAlerts = async () => {
      if (!teamId) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/responder/${teamId}`);
        console.log(res.data);
        setAssignedAlerts(res.data || []);
      } catch (error) {
        setError("Failed to fetch assigned alerts.");
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedAlerts();
  }, [teamId]);

  if (loading) return <p className="text-gray-500 p-4">Loading assigned alerts...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!assignedAlerts.length) return <p className="text-blue-500 p-4">No alerts assigned to your team yet.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Assigned Alerts</h1>

      {assignedAlerts.map((alert) => (
        <div key={alert._id} className="bg-white shadow-md rounded-md p-5 mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">{alert.name}</h2>
          <p className="text-gray-600 mb-1"><strong>Location:</strong> {alert.location}</p>
          <p className="text-gray-600 mb-3"><strong>Date:</strong> {new Date(alert.date).toLocaleDateString()}</p>

          {alert.assignments
  
  .map((assignments) => (
    <div key={assignments._id} className="border-t border-gray-200 pt-4 mt-4 space-y-1">
      <p><span className="font-semibold">Task:</span> {assignments.task}</p>
      <p><span className="font-semibold">Status:</span> {assignments.status}</p>
      <p><span className="font-semibold">Description:</span> {assignments.description || "No description provided"}</p>
      {assignments.deploymentLocation && (
        <p>
          <span className="font-semibold">Deployment:</span>{" "}
          Lat: {assignments.deploymentLocation.lat}, Lng: {assignments.deploymentLocation.lng}
        </p>
      )}

      <div className="mt-2">
        <h4 className="font-medium text-gray-700">Resources:</h4>
        {assignments.assignedResources?.length > 0 ? (
          assignments.assignedResources.map((res) => (
            <div key={res._id} className="text-gray-600 ml-2">
              • {res.name} ({res.type}) — {res.quantity}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No resources assigned</p>
        )}
      </div>
    </div>
))}

        </div>
      ))}
    </div>
  );
};

export default ResponderAssignedAlertsPage;
