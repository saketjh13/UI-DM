import React, { useState, useEffect } from 'react';
import SummaryCard from './SummaryCard';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import ItemsCardGrid from './ItemsCardGrid';

const ResourceDashboard = ({ resources }) => {
  const resourceTypes = Object.keys(resources);
  const [selectedResource, setSelectedResource] = useState(resourceTypes[0] || '');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const selectedResourceData = resources[selectedResource] || [];
  const selectedItem = selectedResourceData[selectedItemIndex] || null;

  useEffect(() => {
    // Reset selected item index when resource type changes
    setSelectedItemIndex(0);
  }, [selectedResource]);

  const totalAvailable = selectedResourceData.reduce((sum, item) => sum + item.availableQuantity, 0);
  const totalRequested = selectedResourceData.reduce((sum, item) => sum + item.requestedQuantity, 0);

  return (
    <div className="p-6 space-y-8">
      {/* Tabs for Resource Types */}
      <div className="flex flex-wrap gap-3">
        {resourceTypes.map((resourceType) => (
          <button
            key={resourceType}
            onClick={() => setSelectedResource(resourceType)}
            className={`px-4 py-2 rounded-2xl font-medium shadow-sm transition-all ${
              selectedResource === resourceType
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
          >
            {resourceType}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Items" value={selectedResourceData.length} />
        <SummaryCard title="Available" value={totalAvailable} />
        <SummaryCard title="Requested" value={totalRequested} />
        <SummaryCard
          title="Fulfillment %"
          value={
            totalRequested === 0
              ? '100%'
              : `${Math.min(Math.round((totalAvailable / (totalAvailable + totalRequested)) * 100), 100)}%`
          }
        />
      </div>

      {/* Charts Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Donut Chart */}
        <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow p-4">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">Availability Overview</h4>
          <DonutChart data={selectedResourceData} />
        </div>

        {/* Bar Chart + Selector */}
        <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow p-4 space-y-4">
          <div>
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Item Breakdown</h4>
            {/* Item Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedResourceData.map((item, index) => (
                <button
                  key={item.resource}
                  onClick={() => setSelectedItemIndex(index)}
                  className={`px-3 py-1 rounded-full border ${
                    selectedItemIndex === index
                      ? 'bg-green-600 text-white border-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.resource}
                </button>
              ))}
            </div>
            {/* Bar Chart for selected item */}
            <BarChart data={selectedItem ? [selectedItem] : []} />
          </div>
        </div>
      </div>

      {/* Grid of Resource Items */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">{selectedResource} Items</h3>
        <ItemsCardGrid data={selectedResourceData} />
      </div>
    </div>
  );
};

export default ResourceDashboard;
