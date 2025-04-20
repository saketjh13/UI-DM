import React from "react";
import TaskCard from "./TaskCard";

const CompletedTasks = ({ tasks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default CompletedTasks;
