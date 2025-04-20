import { useState } from "react";
import CreateTeamModal from "./CreateTeamModal";
import TeamList from "./TeamList"; // Import the TeamList component

const Teams = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState("active"); // 'active' or 'benched'

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="p-6">
      {/* Header with Toggle and Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Teams</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveView("active")}
            className={`px-4 py-2 rounded ${
              activeView === "active" ? "bg-orange-500 text-white" : "bg-gray-300 text-black"
            }`}
          >
            Active Teams
          </button>
          <button
            onClick={() => setActiveView("benched")}
            className={`px-4 py-2 rounded ${
              activeView === "benched" ? "bg-orange-500 text-white" : "bg-gray-300 text-black"
            }`}
          >
            Benched Teams
          </button>
          <button
            onClick={handleOpenModal}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create New Team
          </button>
        </div>
      </div>

      {/* Team List */}
      <div className="mt-6">
        <TeamList activeView={activeView} /> {/* Render the TeamList component and pass activeView prop */}
      </div>

      {/* Create Team Modal */}
      {showModal && <CreateTeamModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Teams;
