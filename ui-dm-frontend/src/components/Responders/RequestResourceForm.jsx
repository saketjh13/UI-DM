import React, { useState } from "react";
import axios from "axios";
import { useResources } from "../../context/ResourceContext"; // 👈 Make sure this path is correct

const RequestResourceForm = ({ teamId, eventId, taskId }) => {
  const { resources, loading, error: resourceError } = useResources();
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [customResourceName, setCustomResourceName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalResourceName = customResourceName;
    let resourceId = null;
    const defaultResource = resources[0] || {}; 

const teamId = defaultResource.teamId;
const eventId = defaultResource.eventId;
const taskId = defaultResource.taskId;

    if (!customResourceName && selectedResourceId) {
      const selectedResource = resources.find(res => res._id === selectedResourceId);
      finalResourceName = selectedResource?.name || "";
      resourceId = selectedResourceId;
    }

    if (!resourceType) {
      setError("Please select a resource type.");
      return;
    }

    if (!finalResourceName) {
      setError("Please select or enter a resource name.");
      return;
    }

    const payload = {
      resourceType,
      resourceName: finalResourceName,
      quantity,
      notes,
      teamId,  // From props
      eventId, // From props
      taskId,  // From props
    };
    const fixedPayload = {
      ...payload,
      quantity: Number(payload.quantity), // convert to number
      notes: payload.notes?.trim() || undefined // remove empty notes
    };

    try {
      console.log(payload);

      await axios.post("http://localhost:5000/api/request-resource", fixedPayload);
      setSuccess(true);
      setError("");

      // Reset the form
      setSelectedResourceId("");
      setCustomResourceName("");
      setQuantity("");
      setNotes("");
      setResourceType("");
    } catch (err) {
      console.error("Error submitting request:", err);
      setError("Failed to submit request. Please try again later.");
    }
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
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      {resourceError && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {resourceError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resource Type */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Resource Type
          </label>
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">-- Choose --</option>
            <option value="Medical">Medical</option>
            <option value="Food">Food</option>
            <option value="Shelter">Shelter</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Select from Available Resources */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Select Existing Resource
          </label>
          <select
            value={selectedResourceId}
            onChange={(e) => setSelectedResourceId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={loading}
            required={!customResourceName}
          >
            <option value="">-- Choose --</option>
            {resources.map((res) => (
              <option key={res._id} value={res._id}>
                {res.name}
              </option>
            ))}
          </select>
        </div>

        {/* OR Enter Custom Resource */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Enter Custom Resource
          </label>
          <input
            type="text"
            value={customResourceName}
            onChange={(e) => setCustomResourceName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="E.g., Oxygen Cylinders, Water Bottles"
            required={!selectedResourceId}
          />
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
            placeholder="Any special instructions?"
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
