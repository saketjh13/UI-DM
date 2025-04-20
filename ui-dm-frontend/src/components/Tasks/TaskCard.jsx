import React from "react";

const TaskCard = ({ task }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold">{task.name}</h3>
      <p className="text-gray-600">Assigned Team: {task.team}</p>
      <p className="text-gray-600">Event: {task.event}</p>
      <p className={`text-sm font-bold ${task.status === "Completed" ? "text-green-600" : "text-orange-600"}`}>
        Status: {task.status}
      </p>
    </div>
  );
};

export default TaskCard;
