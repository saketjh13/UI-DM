import { useEffect, useState } from "react";
import axios from "axios";

const ResourceList = ({ resources, loading, error }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {loading ? (
        <p className="text-gray-500">Loading resources...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : resources.length > 0 ? (
        resources.map((resource) => (
          <div key={resource._id} className="bg-white p-4 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold text-gray-800">{resource.name}</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Type:</strong> {resource.type}</p>
              <p><strong>Quantity:</strong> {resource.quantity}</p>
              <p><strong>Location:</strong> {resource.location}</p>
            </div>
            <button className="mt-2 text-blue-500 hover:underline">View Details</button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No resources available</p>
      )}
    </div>
  );
};

export default ResourceList;
