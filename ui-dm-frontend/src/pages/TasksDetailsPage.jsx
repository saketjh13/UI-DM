import React from "react";
import { useParams } from "react-router-dom";

const TaskDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-orange-600">Task Details</h1>
      <p>Details for Task ID: {id}</p>
      {/* Here, we'll fetch task details, status, and assigned responders */}
    </div>
  );
};

export default TaskDetailsPage;
