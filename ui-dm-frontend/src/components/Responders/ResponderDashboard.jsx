import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResponderDashboard = ({ teamId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState('');
  
  // Fetch events based on the teamId
  useEffect(() => {
    const fetchResponderEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/events/responder/${teamId}`);
        console.log(res.data)
        setEvents(res.data);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error fetching responder events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResponderEvents();
  }, [teamId]);

  const handleStatusChange = async (taskId) => {
    const statusCycle = { Pending: 'Completed', Completed: 'Failed', Failed: 'Pending' };
    const updatedEvents = events.map(event => ({
      ...event,
      assignments: event.assignments.map(task =>
        task._id === taskId
          ? { ...task, status: statusCycle[task.status] }
          : task
      ),
    }));

    setEvents(updatedEvents);

    try {
      const updatedTask = updatedEvents.flatMap(event => event.assignments).find(task => task._id === taskId);
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: updatedTask.status });
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Failed to update task status:', err);
    }
  };

  const filteredTasks = (taskList) => {
    if (statusFilter === 'All') return taskList;
    return taskList.filter(task => task.status === statusFilter);
  };

  // Function to display status color based on task status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-500';
      case 'Completed':
        return 'text-green-600';
      case 'Failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Responder Dashboard</h2>

      {/* Status Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {['All', 'Pending', 'Completed', 'Failed'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1 rounded-full text-sm font-medium border transition ${
              statusFilter === status
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Error or Loading States */}
      {loading && !error ? (
        <p className="text-gray-500">Loading events...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-red-500">No events found for your team.</p>
      ) : (
        events.map(event => (
          <div key={event._id} className="mb-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
            <p className="text-gray-500 text-sm mb-2">Location: {event.location}</p>
            <p className="text-gray-500 text-sm mb-4">Date: {new Date(event.date).toLocaleDateString()}</p>

            {/* Filtered Task List */}
            {filteredTasks(event.assignments).length === 0 ? (
              <p className="text-gray-400 text-sm">No tasks under "{statusFilter}"</p>
            ) : (
              filteredTasks(event.assignments).map(task => (
                <div key={task._id} className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">{task.task}</p>
                      <p className="text-sm text-gray-500 mb-1">{task.description}</p>
                      <p className="text-sm mb-1">
                        Location: {task.deploymentLocation.lat}, {task.deploymentLocation.lng}
                      </p>
                      <p
                        onClick={() => handleStatusChange(task._id)}
                        className={`text-sm cursor-pointer font-medium ${getStatusColor(task.status)}`}
                      >
                        Status: {task.status} (Click to update)
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ResponderDashboard;
