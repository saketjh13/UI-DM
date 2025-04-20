import React from 'react';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
};

const StatsOverview = ({ tasks }) => {
  const total = tasks.length;

  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {
      Pending: 0,
      'In Progress': 0,
      Completed: 0,
    }
  );

  const stats = [
    { label: 'Total Tasks', value: total, color: 'bg-gray-100 text-gray-800' },
    { label: 'Pending', value: statusCounts.Pending, color: statusColors['Pending'] },
    { label: 'In Progress', value: statusCounts['In Progress'], color: statusColors['In Progress'] },
    { label: 'Completed', value: statusCounts.Completed, color: statusColors['Completed'] },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`p-4 rounded-lg shadow-sm ${stat.color} text-center`}
        >
          <h4 className="text-md font-semibold">{stat.label}</h4>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
