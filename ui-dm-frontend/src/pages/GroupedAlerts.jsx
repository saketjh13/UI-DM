import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GroupedAlerts = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupedReports = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = storedUser?.token;
        const res = await axios.get("http://localhost:5000/api/reports/grouped", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(res.data);
      } catch (err) {
        console.error("Failed to fetch grouped alerts", err);
      }
    };

    fetchGroupedReports();
  }, []);

  const handleCreateEvent = (groupReports) => {
    const alertData = groupReports.map((report) => ({
      _id: report._id,
      disasterType: report.disasterType,
      intensity: report.intensity,
      description: report.description,
      location: {
        lat: report.latitude,
        lon: report.longitude,
      },
      landmark: report.landmark,
      requests: report.requests,
      mediaUrls: report.mediaUrls,
      sender: {
        _id: report.sender?._id,
        name: report.sender?.name,
        email: report.sender?.email,
      },
      createdAt: report.createdAt,
    }));

    navigate("/events/create", {
      state: {
        reports: groupReports,
        alertData,
      },
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Grouped Disaster Alerts</h2>

      {groups.map((group, idx) => (
        <div key={idx} className="bg-white border rounded shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg text-gray-800">
              {group.groupName} ({group.reports?.length || 0} reports)
            </h3>
            <button
              onClick={() => handleCreateEvent(group.reports)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Create Event
            </button>
          </div>
          <ul className="mt-2 space-y-2">
            {group.reports?.map((report) => (
              <li
                key={report._id}
                className="bg-gray-50 border p-3 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/alerts/${report._id}`)}
              >
                <p><strong>Type:</strong> {report.disasterType}</p>
                <p><strong>Intensity:</strong> {report.intensity}</p>
                <p><strong>Description:</strong> {report.description}</p>
                <p><strong>Location:</strong> {report.latitude}, {report.longitude}</p>
                {report.sender && report.sender.name && report.sender.email && (
                  <p>
                    <strong>Reported by:</strong> {report.sender.name} ({report.sender.email})
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GroupedAlerts;
