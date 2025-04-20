import React from 'react';

const ResourceCard = ({ resource }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200 bg-white">
      <h3 className="text-lg font-semibold text-gray-800">{resource.name}</h3>
      <p className="text-sm text-gray-600 mt-1">
        Type: <span className="font-medium">{resource.type || '—'}</span>
      </p>
      <p className="text-sm text-gray-600">
        Quantity: <span className="font-medium">{resource.quantity}</span>
      </p>
      <p className="text-sm text-gray-600">
        Location: <span className="font-medium">{resource.location || 'N/A'}</span>
      </p>
    </div>
  );
};

export default ResourceCard;
