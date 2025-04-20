// SummaryCard.jsx
import React from 'react';

const SummaryCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-2xl text-gray-600 mt-2">{value || 0}</p>
    </div>
  );
};

export default SummaryCard;
