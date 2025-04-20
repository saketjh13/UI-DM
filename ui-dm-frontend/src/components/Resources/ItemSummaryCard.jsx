import React from 'react';

const ItemSummaryCard = ({ name, quantity, available, requested }) => {
  return (
    <div className="item-summary-card">
      <h4>{name}</h4>
      <p>Total Quantity: {quantity}</p>
      <p>Available: {available}</p>
      <p>Requested: {requested}</p>
    </div>
  );
};

export default ItemSummaryCard;
