import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useResources } from "../../context/ResourceContext";

function EventDetails() {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [responderTasks, setResponderTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fulfillQuantities, setFulfillQuantities] = useState({});
  const { resources: responderResources, loading: resLoading } = useResources();

  useEffect(() => {
    fetchEventAndTasks();
  }, []);

  const fetchEventAndTasks = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) throw new Error("User not found in localStorage");
      const { teamID } = JSON.parse(userData);
      if (!teamID) throw new Error("teamID missing from user data");

      const [eventRes, taskRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/events/${eventId}`),
        axios.get(`http://localhost:5000/api/tasks/responder/${teamID}`),
      ]);

      setEventData(eventRes.data);
      setResponderTasks(taskRes.data);

      console.log("✅ Event Data:", eventRes.data);
      console.log("✅ Responder Tasks:", taskRes.data);
    } catch (err) {
      console.error("Error fetching data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (requestId, value) => {
    setFulfillQuantities((prev) => ({
      ...prev,
      [requestId]: value,
    }));
  };

  const fulfillRequest = async (requestId) => {
    try {
      const quantity = fulfillQuantities[requestId];
      if (!quantity || quantity <= 0) {
        alert("Enter a valid quantity to fulfill.");
        return;
      }

      await axios.post(`http://localhost:5000/api/request-resource/from-request/${requestId}`, {
        quantity: Number(quantity),
      });

      alert("Request fulfilled successfully!");
      fetchEventAndTasks(); // Refresh both
    } catch (err) {
      console.error("Error fulfilling request:", err);
      alert("Error fulfilling the request. Check console.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading event data...</div>;
  if (!eventData) return <div className="text-center mt-10">No event found.</div>;

  const { eventName, description, location, createdAt, tasks = [], resourceRequests = [] } = eventData;

  const assignedResourcesForEvent = responderResources?.filter(
    (r) => r.eventId?.toString() === eventId
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Event Info */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">{eventName}</h1>
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-sm text-gray-400">
          Location: {location?.area}, {location?.city}
        </p>
        <p className="text-sm text-gray-400">
          Created At: {new Date(createdAt).toLocaleString()}
        </p>
      </div>

      {/* Assigned Tasks */}


      {/* Resource Requests */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Requested Resources</h2>
        {resourceRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Resource</th>
                  <th className="px-4 py-2 text-left">Requested Qty</th>
                  <th className="px-4 py-2 text-left">Fulfilled Qty</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Fulfill</th>
                </tr>
              </thead>
              <tbody>
                {resourceRequests.map((req) => (
                  <tr key={req._id} className="border-t">
                    <td className="px-4 py-2">
                      {req.resourceName} ({req.resourceType})
                    </td>
                    <td className="px-4 py-2">{req.quantity}</td>
                    <td className="px-4 py-2">{req.fulfilledQuantity || 0}</td>
                    <td className="px-4 py-2">{req.status}</td>
                    <td className="px-4 py-2 flex gap-2 items-center">
                      <input
                        type="number"
                        className="border rounded p-1 w-20"
                        min="1"
                        placeholder="Qty"
                        value={fulfillQuantities[req._id] || ""}
                        onChange={(e) =>
                          handleQuantityChange(req._id, e.target.value)
                        }
                      />
                      <button
                        onClick={() => fulfillRequest(req._id)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                      >
                        Fulfill
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No resource requests yet.</p>
        )}
      </div>
      <div className="bg-white shadow-md rounded-xl p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Reported Alerts</h2>

        {responderTasks.length > 0 ? (
          responderTasks
            .map((task) => (
              task.alertData && task.alertData.length > 0 && (
                <div key={task._id} className="mb-6">
                  {task.alertData.map((alert, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4 shadow-sm bg-gray-50">
                      <p className="text-md font-semibold text-red-600">Description: {alert.description}</p>
                      <p className="text-sm text-gray-700">Severity: {alert.severity}/10</p>
                      <p className="text-sm text-gray-700">Location: {alert.location}</p>

                      {/* <div className="mt-2 flex flex-wrap gap-2">
                  {alert.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Alert Image ${i + 1}`}
                      className="w-32 h-20 object-cover rounded border"
                    />
                  ))}
                </div> */}

                      <p className="text-xs text-gray-400 mt-2">
                        Reported At: {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )
            ))
        ) : (
          <p className="text-gray-500">No alerts submitted for this task.</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Assigned Tasks Overview</h2>

        {responderTasks.length > 0 ? (
          responderTasks.map((task) => (
            <div key={task._id} className="border-b py-4">
              {task.assignments && task.assignments.length > 0 && (
                task.assignments.map((assignment, idx) => (
                  <div key={idx} className="border rounded-lg p-4 mb-4 shadow-sm bg-gray-50">
                    <h3 className="text-lg font-semibold text-indigo-600">{assignment.taskName}</h3>
                    <p className="text-gray-700">Description: {assignment.description}</p>
                    <p className="text-sm text-gray-500 mb-2">Status: {assignment.status}</p>

                    {assignment.assignedTeams && assignment.assignedTeams.length > 0 && (
                      <p className="text-sm text-gray-700">
                        Team: <span className="font-semibold">{assignment.assignedTeams[0].name}</span>
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No assignments available.</p>
        )}
      </div>

      {/* Responder's Own Tasks
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Your Tasks for This Event</h2>
        {responderTasks.length > 0 ? responderTasks
          .filter((task) => task.eventId === eventId)
          .map((task) => (
            <div key={task._id} className="border-b py-4">
              <h3 className="text-lg font-semibold">{task.taskName}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-400">
                Deployment Location: {task.deploymentLocation}
              </p>
              <p className="text-sm text-gray-400">Status: {task.status}</p>
            </div>
          )) : <p>No tasks assigned to you for this event.</p>}
      </div> */}

      {/* Assigned Resources (from context) */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Resources</h2>

        {responderTasks.length > 0 ? (
          responderTasks
            // .filter((task) => task.eventId === eventId) // Uncomment if needed
            .map((task) => (
              task.assignments && task.assignments.length > 0 && task.assignments[0].assignedResources.length > 0 && (
                <div key={task._id} className="mb-6">
                  {task.assignments[0].assignedResources.map((resource, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4 shadow-sm">
                      <p className="text-md font-semibold text-gray-800">Name: {resource.name}</p>
                      <p className="text-sm text-gray-600">Type: {resource.type}</p>
                      <p className="text-sm text-gray-600">Quantity: {resource.quantity}</p>
                      <p className="text-sm text-gray-600">Location: {resource.location}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created At: {new Date(resource.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )
            ))
        ) : (
          <p className="text-gray-500">No tasks assigned to you for this event.</p>
        )}
      </div>


      {/* Team Information */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Teams</h2>
        {responderTasks.length > 0 ? responderTasks[0].assignments && responderTasks[0].assignments.length > 0 ? (
          responderTasks[0].assignments[0].assignedTeams && responderTasks[0].assignments[0].assignedTeams.length > 0 ? (
            responderTasks[0].assignments[0].assignedTeams.map((team) => (
              <div key={team.teamId} className="mb-4">
                <h3 className="font-semibold">{team.name} ({team.type})</h3>
                <p className="text-sm text-gray-600">Captain: {responderTasks[0].assignments[0].assignedTeams[0].captain}</p>
                <p className="text-sm text-gray-600">
                  Members: {team.members.map((member) => member.name).join(", ")}
                </p>

                <p className="text-sm text-gray-600">Location: {team.location}</p>
              </div>
            ))
          ) : <p>No teams assigned.</p>
        ) : <p>No team assignments available.</p> : <p>Loading tasks...</p>}
      </div>
    </div>
  );
}

export default EventDetails;
