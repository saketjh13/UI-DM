import { useState } from "react";
import axios from "axios";

const RESOURCE_TYPES = [
  "Medical Kits",
  "Food Packets",
  "Shelters",
  "Ambulances",
  // "Rescue Members",
];

const CreateResourceModal = ({ onClose, onResourceCreated }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState(RESOURCE_TYPES[0]);
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !type || !location || !quantity || isNaN(quantity) || Number(quantity) < 1) {
      setError("Please fill all fields correctly.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/resources", {
        name,
        type,
        quantity: Number(quantity),
        location,
      });

      onResourceCreated();
      onClose();
    } catch (err) {
      console.error("Error creating resource:", err);
      setError("Failed to create resource.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Create New Resource</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Resource Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Resource Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              {RESOURCE_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResourceModal;
