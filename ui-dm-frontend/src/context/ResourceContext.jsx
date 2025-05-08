import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ResourceContext = createContext();

export const useResources = () => useContext(ResourceContext);

export const ResourceProvider = ({ children }) => {
  const [teamId, setTeamId] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get teamID on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setError("No user found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const { teamID, role } = parsed || {};
      if (!teamID || role !== "responder") {
        setError("Invalid credentials. Access denied.");
        setLoading(false);
        return;
      }
      setTeamId(teamID);
    } catch {
      setError("Corrupted user data. Please log in again.");
      setLoading(false);
    }
  }, []);

  // Fetch and enhance resources
  useEffect(() => {
    const fetchResources = async () => {
      if (!teamId) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/responder/${teamId}`);
        const tasks = res.data || [];

        const allResources = tasks.flatMap(task =>
            task.assignments?.flatMap(assignment =>
              (assignment.assignedResources || []).map(resource => ({
                ...resource,
                eventId: task._id || null,        // This is your eventId
                taskId: assignment._id || null,   // This is your taskId
                teamId: teamId || null,            // Still tagging teamId
              }))
            )
          ).filter(Boolean);
          

        const uniqueResources = {};
        allResources.forEach(res => {
          if (res?._id) {
            uniqueResources[res._id] = res;
          }
        });

        setResources(Object.values(uniqueResources));
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Failed to load resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [teamId]);

  return (
    <ResourceContext.Provider value={{ resources, loading, error }}>
      {children}
    </ResourceContext.Provider>
  );
};
