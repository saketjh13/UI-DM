// ItemsCardGrid.jsx
import React from 'react';

const ItemsCardGrid = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-lg font-semibold">{item.resource}</h4>
          <p>Available: {item.availableQuantity}</p>
          <p>Requested: {item.requestedQuantity}</p>
        </div>
      ))}
    </div>
  );
};

export default ItemsCardGrid;
