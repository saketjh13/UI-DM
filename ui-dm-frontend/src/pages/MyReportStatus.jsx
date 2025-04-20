import { useEffect, useState } from "react";
import axios from "axios";

const MyReportStatus = () => {
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyReports = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/reports/my-reports", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(response.data)
      setMyReports(response.data);
    } catch (err) {
      console.error("Error fetching my reports:", err);
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">📋 My Submitted Reports</h2>

      {loading && <p>Loading your reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {myReports.length === 0 && !loading && !error && (
        <p className="text-gray-600">You haven’t submitted any disaster reports yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myReports.map(({ report, event }) => (
          <div key={report._id.toString()} className="bg-white border p-4 rounded shadow">
            <h3 className="text-lg font-bold text-red-600">{report.disasterType}</h3>
            <p className="text-gray-600 text-sm mb-2">
              Submitted on: {new Date(report.createdAt).toLocaleString()}
            </p>

            <p><span className="font-semibold">Intensity:</span> {report.intensity}</p>
            <p><span className="font-semibold">Description:</span> {report.description}</p>
            {report.landmark && (
              <p><span className="font-semibold">Landmark:</span> {report.landmark}</p>
            )}
            <p><span className="font-semibold">Status:</span> {event ? "Event Created ✅" : "Pending ⏳"}</p>

            {event && (
              <>
                <p className="text-sm text-green-600 mt-2">🔗 Linked Event: {event.name}</p>
                {event.assignments.map((task, idx) => (
                  <div
                    key={`${report._id}-task-${idx}`}
                    className="bg-gray-50 border border-gray-200 rounded p-3 mb-3"
                  >
                    <p>
                      <span className="font-semibold">🛠️ Task:</span> {task.task}
                    </p>

                    {task.status && (
                      <p>
                        <span className="font-semibold">📌 Status:</span>{" "}
                        <span
                          className={
                            task.status === "Completed"
                              ? "text-green-600"
                              : task.status === "In Progress"
                                ? "text-yellow-600"
                                : "text-gray-700"
                          }
                        >
                          {task.status}
                        </span>
                      </p>
                    )}

                    {task.assignedTeams && task.assignedTeams.length > 0 && (
                      <p>
                        <span className="font-semibold">👥 Team(s):</span>{" "}
                        {task.assignedTeams.map((t) => t.name).join(", ")}
                      </p>
                    )}

                    {task.deploymentLocation?.lat && task.deploymentLocation?.lng && (
                      <p>
                        <span className="font-semibold">📍 Location:</span>{" "}
                        Lat: {task.deploymentLocation.lat}, Lng: {task.deploymentLocation.lng}
                      </p>
                    )}
                  </div>
                ))}

              </>
            )}

            {/* Uncomment to show uploaded images */}
            {/* {report.mediaUrls && report.mediaUrls.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold mb-1">Images:</p>
                <div className="grid grid-cols-2 gap-2">
                  {report.mediaUrls.map((imgUrl, index) => (
                    <img
                      key={`${report._id}-img-${index}`}
                      src={imgUrl}
                      alt={`Report Image ${index + 1}`}
                      className="w-full h-40 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )} */}

            {/* Uncomment to show requested resources */}
            {/* {report.requests && Object.keys(report.requests).length > 0 && (
              <div className="mt-3">
                <p className="font-semibold mb-1">Requested Resources:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {Object.entries(report.requests).map(([type, data], index) => (
                    data.checked && (
                      <li key={`${report._id}-request-${type}-${index}`}>
                        {type} — Qty: {data.quantity}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReportStatus;
