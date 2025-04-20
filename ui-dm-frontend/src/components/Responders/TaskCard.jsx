import React from 'react';

const statusColors = {
  Pending: 'text-yellow-500',
  "In Progress": 'text-blue-500',
  Completed: 'text-green-600',
  Failed: 'text-red-500',
};

const TaskCard = ({ task, onStatusChange }) => {
  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-lg">{task.task}</p>
          <p className="text-sm text-gray-500 mb-1">{task.description}</p>
          <p className="text-sm text-gray-500 mb-1">
            Deployment Location: {task.deploymentLocation.lat}, {task.deploymentLocation.lng}
          </p>

          <div className="mt-2">
            <label className="text-sm font-medium text-gray-600 mr-2">Status:</label>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className={`px-2 py-1 rounded border ${statusColors[task.status]}`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
