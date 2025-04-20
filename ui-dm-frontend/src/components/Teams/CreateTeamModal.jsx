import { useState } from "react";
import axios from "axios";

const CreateTeamModal = ({ onClose, onTeamCreated }) => {
  const [teamId, setTeamId] = useState(""); // New: teamId field
  const [teamName, setTeamName] = useState("");
  const [teamType, setTeamType] = useState("Rescue");
  const [teamCaptain, setTeamCaptain] = useState("");
  const [location, setLocation] = useState("");
  const [members, setMembers] = useState([{ name: "", role: "", employeeId: "", age: "" }]);
  const [loading, setLoading] = useState(false);

  const addMember = () => {
    setMembers([...members, { name: "", role: "", employeeId: "", age: "" }]);
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleSubmit = async () => {
    if (
      !teamName ||
      !teamCaptain ||
      !location ||
      members.some(m => !m.name || !m.role || !m.employeeId || !m.age)
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:5000/api/teams", {
        teamId: teamId.trim() || undefined,
        name: teamName,
        type: teamType,
        captain: teamCaptain,
        location,
        members,
      });

      alert(data.message);
      onClose();
      onTeamCreated();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create New Team</h2>

        {/* Team ID */}
        <input
          type="text"
          placeholder="Team ID (optional)"
          className="w-full p-2 border rounded mb-3"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />

        {/* Team Name */}
        <input
          type="text"
          placeholder="Team Name"
          className="w-full p-2 border rounded mb-3"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        {/* Team Type */}
        <select
          className="w-full p-2 border rounded mb-3"
          value={teamType}
          onChange={(e) => setTeamType(e.target.value)}
        >
          <option value="Rescue">Rescue</option>
          <option value="Medical">Medical</option>
          <option value="Transport">Transport</option>
        </select>

        {/* Captain */}
        <input
          type="text"
          placeholder="Captain Name"
          className="w-full p-2 border rounded mb-3"
          value={teamCaptain}
          onChange={(e) => setTeamCaptain(e.target.value)}
        />

        {/* Location */}
        <input
          type="text"
          placeholder="Team Location"
          className="w-full p-2 border rounded mb-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Team Members */}
        <div className="mb-3">
          <h3 className="font-semibold mb-2">Team Members</h3>
          {members.map((member, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 mb-2 relative">
              <input
                type="text"
                placeholder="Name"
                className="p-2 border rounded"
                value={member.name}
                onChange={(e) => updateMember(index, "name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Role"
                className="p-2 border rounded"
                value={member.role}
                onChange={(e) => updateMember(index, "role", e.target.value)}
              />
              <input
                type="text"
                placeholder="Employee ID"
                className="p-2 border rounded"
                value={member.employeeId}
                onChange={(e) => updateMember(index, "employeeId", e.target.value)}
              />
              <input
                type="number"
                placeholder="Age"
                className="p-2 border rounded"
                value={member.age}
                onChange={(e) => updateMember(index, "age", e.target.value)}
              />
              {members.length > 1 && (
                <button
                  className="absolute -right-6 top-2 text-red-500 text-lg"
                  onClick={() => removeMember(index)}
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button className="text-blue-500 hover:underline mt-2" onClick={addMember}>
            + Add Member
          </button>
        </div>

        {/* Create & Cancel Buttons */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"}`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Team"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
