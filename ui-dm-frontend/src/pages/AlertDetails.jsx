import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AlertDetails = () => {
    const { alertId } = useParams();
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null);

    const userRole = JSON.parse(localStorage.getItem("user"))?.role?.toLowerCase() || "guest";

    useEffect(() => {
        const fetchAlertDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/reports/${alertId}`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                setAlert(data);
            } catch (error) {
                console.error("Error fetching alert details:", error);
            }
        };

        fetchAlertDetails();
    }, [alertId]);

    // ✅ Function to update status (Admin only)
    const updateAlertStatus = async () => {
        let newStatus = alert.status === "Yet to Review" ? "Yet to be Dealt" : "Dealt";

        try {
            const response = await fetch(`http://localhost:5000/api/reports/${alertId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update status");

            const updatedAlert = await response.json();
            setAlert(updatedAlert.report);
        } catch (error) {
            console.error("Error updating alert status:", error);
        }
    };

    if (!alert) return <p>Loading...</p>;

    return (
        <div className="p-6 pt-20 md:ml-64 bg-gray-100 min-h-screen flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-3xl font-bold text-orange-600 mb-4">{alert.disasterType}</h2>

                {/* ✅ Status Label */}
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${alert.status === "Yet to Review" ? "bg-yellow-200 text-yellow-800" :
                        alert.status === "Yet to be Dealt" ? "bg-blue-200 text-blue-800" :
                            "bg-green-200 text-green-800"
                    }`}>
                    {alert.status}
                </span>

                <div className="mt-4 grid md:grid-cols-3 gap-6">
                    {/* Left Column (Disaster Details) */}
                    <div className="col-span-2">
                        <p className="text-gray-600"><strong>Intensity:</strong> {alert.intensity}</p>
                        <p className="text-gray-600"><strong>Description:</strong> {alert.description}</p>
                        <p className="text-gray-600"><strong>Location:</strong> {alert.latitude}, {alert.longitude}</p>

                        {/* ✅ Disaster Image */}
                        {alert.mediaUrl && (
                            <img
                                src={`http://localhost:5000${alert.mediaUrl}`}
                                alt="Disaster"
                                className="mt-4 w-full max-w-md rounded-lg cursor-pointer transition hover:scale-105"
                                onClick={() => window.open(`http://localhost:5000${alert.mediaUrl}`, "_blank")}
                            />
                        )}
                    </div>

                    {/* ✅ Sidebar - User Info */}
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">Reported By</h3>
                        <p className="text-gray-600"><strong>Reported By:</strong> {alert.reportedBy?.name || "Anonymous"}</p>
                        <p className="text-gray-600"><strong>Aadhaar:</strong> {alert.reportedBy?.aadhaar ? `**** **** ${alert.reportedBy.aadhaar.slice(-4)}` : "N/A"}</p>
                        <p className="text-gray-600"><strong>Contact:</strong> {alert.reportedBy?.contact || "N/A"}</p>

                    </div>
                </div>

                {/* ✅ Admin Actions */}
                {userRole === "admin" && (
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={updateAlertStatus}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {alert.status === "Yet to Review" ? "Mark as Yet to be Dealt" : "Mark as Dealt"}
                        </button>

                        {alert.status !== "Dealt" && (
                            <button
                                onClick={() => navigate(`/create-event?alertId=${alert._id}`)}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                                Create Event
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertDetails;
