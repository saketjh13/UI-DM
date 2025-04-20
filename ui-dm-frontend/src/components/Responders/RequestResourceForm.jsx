import React, { useState } from "react";

const resourceOptions = [
  "Medical Kits",
  "Food Packets",
  "Shelters",
  "Ambulances",
];

const RequestResourceForm = () => {
  const [selectedResource, setSelectedResource] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Later: send to backend
    console.log({
      resource: selectedResource,
      quantity,
      notes,
    });

    // Mock success
    setSuccess(true);
    setSelectedResource("");
    setQuantity("");
    setNotes("");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Request Resources
      </h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          Request submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resource Type */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Select Resource
          </label>
          <select
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">-- Choose --</option>
            {resourceOptions.map((res) => (
              <option key={res} value={res}>
                {res}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
            placeholder="Add any specific message or instruction"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestResourceForm;
