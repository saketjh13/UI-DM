import React, { useEffect, useState } from "react";
import ResponderDashboard from "../components/Responders/ResponderDashboard";

const ResponderDashboardPage = () => {
  const [teamId, setTeamId] = useState(null);
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
      setLoading(false);
    };

    init();
  }, []);

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!teamId) return <p className="text-red-500">No team found for this user.</p>;

  return (
    <div className="p-6">
      {/* <h1 className="text-4xl font-bold text-gray-800 mb-6">Responder Dashboard Page</h1> */}
      <ResponderDashboard teamId={teamId} />
    </div>
  );
};

export default ResponderDashboardPage;
