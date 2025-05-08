import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GroupedAlerts = () => {
  const [groups, setGroups] = useState([]);
  const [sensorAlerts, setSensorAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState("grouped");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = storedUser?.token;

        const [groupedRes, sensorRes] = await Promise.all([
          axios.get("http://localhost:5000/api/reports/grouped", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/sensor-data/alerts/recent", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setGroups(groupedRes.data);
        setSensorAlerts(sensorRes.data);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      }
    };

    fetchData();
  }, []);
  console.log(sensorAlerts)
  const handleCreateEventFromReports = (groupReports) => {
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
      sender: report.sender
        ? {
            _id: report.sender._id,
            name: report.sender.name,
            email: report.sender.email,
          }
        : null,
      createdAt: report.createdAt,
    }));

    navigate("/events/create", {
      state: { reports: groupReports, alertData },
    });
  };

  const handleCreateEventFromSensor = (sensorAlert) => {
    const alertData = [
      {
        disasterType: sensorAlert.sensorType, // using sensorType here
        intensity: sensorAlert.intensity,
        description: "Auto-generated from sensor alert",
        location: {
          lat: sensorAlert.latitude,
          lon: sensorAlert.longitude,
        },
        landmark: sensorAlert.landmark || "",
        requests: [],
        mediaUrls: [],
        sender: null,
        createdAt: sensorAlert.timestamp,
      },
    ];

    navigate("/events/create", {
      state: { reports: [], alertData },
    });
  };

  return (
    <div className="p-4">
      {/* Tab Switch */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("grouped")}
            className={`text-lg font-semibold ${
              activeTab === "grouped" ? "text-orange-600 underline" : "text-gray-500"
            }`}
          >
            Grouped Alerts
          </button>
          <button
            onClick={() => setActiveTab("sensor")}
            className={`text-lg font-semibold ${
              activeTab === "sensor" ? "text-orange-600 underline" : "text-gray-500"
            }`}
          >
            Sensor Alerts
          </button>
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">
        {activeTab === "sensor" ? "Sensor Based Disaster Alerts" : "Grouped Disaster Alerts"}
      </h2>

      {/* Main Content */}
      {activeTab === "sensor" ? (
        <div>
          {sensorAlerts.length === 0 ? (
            <p className="text-center text-gray-500">No sensor alerts available 💤</p>
          ) : (
            sensorAlerts.map((alert) => (
              <div key={alert._id} className="bg-white border rounded shadow p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p><strong>Disaster Type:</strong> {alert.disaster}</p>
                    <p><strong>Intensity:</strong> {alert.intensity}</p>
                    <p><strong>Location:</strong> 28.7213° N, 77.1418° E
</p>
                    <p><strong>Timestamp:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleCreateEventFromSensor(alert)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Create Event
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          {groups.length === 0 ? (
            <p className="text-center text-gray-500">No grouped alerts available 💤</p>
          ) : (
            groups.map((group, idx) => (
              <div key={idx} className="bg-white border rounded shadow p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {group.groupName} ({group.reports?.length || 0} reports)
                  </h3>
                  <button
                    onClick={() => handleCreateEventFromReports(group.reports)}
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
                      {report.sender && (
                        <p><strong>Reported by:</strong> {report.sender.name} ({report.sender.email})</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GroupedAlerts;
