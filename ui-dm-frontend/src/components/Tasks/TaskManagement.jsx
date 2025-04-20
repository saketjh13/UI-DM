import React, { useState } from "react";
import ActiveTasks from "./ActiveTasks";
import CompletedTasks from "./CompletedTasks";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Rescue Operations", team: "Team Alpha", event: "Flood Relief", status: "Active" },
    { id: 2, name: "Medical Assistance", team: "Team Beta", event: "Earthquake Response", status: "Completed" },
  ]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Task Management</h2>
      <h3 className="text-lg font-semibold mb-2">Active Tasks</h3>
      <ActiveTasks tasks={tasks.filter(task => task.status === "Active")} />
      <h3 className="text-lg font-semibold mt-4 mb-2">Completed Tasks</h3>
      <CompletedTasks tasks={tasks.filter(task => task.status === "Completed")} />
    </div>
  );
};

export default TaskManagement;
