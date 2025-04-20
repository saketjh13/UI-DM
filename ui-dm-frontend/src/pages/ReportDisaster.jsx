import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ReportDisaster = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [locationName, setLocationName] = useState("");
  const [manualEntry, setManualEntry] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [showGuide, setShowGuide] = useState(true);
  const [landmark, setLandmark] = useState("");

  const [formData, setFormData] = useState({
    disasterType: "",
    intensity: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [requests, setRequests] = useState([{ resource: "", type: "", quantity: 1 }]);

  const resourceTypes = [
    "Medical",
    "Rescue Members",
    "Shelters",
    "Food Packets",
    "Ambulances",
  ];

  useEffect(() => {
    const reverseGeocode = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        const data = await response.json();
        const { address } = data;
        const name = `${address.suburb || address.city || address.town || address.village || ""}, ${address.state || ""}`;
        setLocationName(name);
      } catch (error) {
        console.warn("Reverse geocoding failed:", error);
      }
    };

    const getBrowserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
          reverseGeocode(latitude, longitude);
        },
        async (error) => {
          console.warn("Geolocation denied or failed. Falling back to IP-based location.");
          await getIpLocation();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    const getIpLocation = async () => {
      try {
        const res = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client");
        const data = await res.json();
        const { latitude, longitude, city, principalSubdivision } = data;

        if (latitude && longitude) {
          setLocation({ latitude, longitude });
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
          setLocationName(`${city}, ${principalSubdivision}`);
        } else {
          console.warn("BigDataCloud did not return coordinates. Switching to manual entry.");
          setManualEntry(true);
        }
      } catch (err) {
        console.error("BigDataCloud location failed:", err);
        setManualEntry(true);
      }
    };

    if ("geolocation" in navigator) {
      getBrowserLocation();
    } else {
      getIpLocation();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setFilePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRequestChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRequests = [...requests];
    updatedRequests[index] = { ...updatedRequests[index], [name]: value };
    setRequests(updatedRequests);
  };

  const handleAddRequest = () => {
    setRequests([...requests, { resource: "", type: "", quantity: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = new FormData();
    reportData.append("disasterType", formData.disasterType);
    reportData.append("intensity", formData.intensity);
    reportData.append("description", formData.description);
    reportData.append("latitude", manualEntry ? formData.latitude : location.latitude);
    reportData.append("longitude", manualEntry ? formData.longitude : location.longitude);
    reportData.append("landmark", landmark);
    reportData.append("requests", JSON.stringify(requests));

    selectedFiles.forEach((file) => reportData.append("files", file));

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: reportData,
      });

      if (response.ok) {
        alert("Disaster report submitted successfully!");
        navigate("/events");
      } else {
        const data = await response.json();
        alert(`Failed to submit report: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-2 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl space-y-6">
        <h2 className="text-2xl font-semibold text-orange-600 text-center">Report Disaster</h2>

        {/* Guide Toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowGuide(!showGuide);
          }}
          className="text-sm text-blue-600 hover:underline focus:outline-none"
        >
          {showGuide ? "Hide" : "Show"} Disaster Intensity Guide
        </button>

        {showGuide && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-gray-700 space-y-1">
            <p><strong>1-2:</strong> Minor Disturbance, No Risk to Life.</p>
            <p><strong>3-4:</strong> Noticeable Disruption, Light Injuries.</p>
            <p><strong>5-6:</strong> Moderate Disaster, Multiple Injuries.</p>
            <p><strong>7-8:</strong> Major Disaster, Casualties Expected.</p>
            <p><strong>9-10:</strong> Catastrophic, Widespread Destruction.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Disaster Info */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-gray-700">Disaster Type</label>
              <input
                type="text"
                name="disasterType"
                value={formData.disasterType}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:border-orange-600"
                required
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-gray-700">Intensity (1–10)</label>
              <input
                type="number"
                name="intensity"
                min="1"
                max="10"
                value={formData.intensity}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:border-orange-600"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-orange-600"
              required
            />
          </div>

          {/* Location Display or Manual Input */}
          {!manualEntry ? (
            <div>
              <p className="text-gray-700">
                Location: <strong>{location.latitude}, {location.longitude}</strong><br />
                Area: <strong>{locationName}</strong>
              </p>
              <div className="mt-2">
                <label className="block text-gray-700">Nearby Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-orange-600"
                  placeholder="e.g., Near ABC Hospital"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-gray-700">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-orange-600"
                  required
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-gray-700">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-orange-600"
                  required
                />
              </div>
            </div>
          )}

          {/* Resource Requests */}
          <div className="space-y-4">
            {requests.map((req, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="text"
                  name="resource"
                  value={req.resource}
                  onChange={(e) => handleRequestChange(index, e)}
                  placeholder="Resource (e.g., Medical Kits)"
                  className="w-1/3 p-2 border rounded-md focus:outline-none focus:border-orange-600"
                />
                <select
                  name="type"
                  value={req.type}
                  onChange={(e) => handleRequestChange(index, e)}
                  className="w-1/3 p-2 border rounded-md focus:outline-none focus:border-orange-600"
                >
                  <option value="">Select Type</option>
                  {resourceTypes.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="quantity"
                  value={req.quantity}
                  onChange={(e) => handleRequestChange(index, e)}
                  min="1"
                  className="w-1/3 p-2 border rounded-md focus:outline-none focus:border-orange-600"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddRequest}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Request More
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700">Upload Files</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:border-orange-600"
            />
            {filePreviews.length > 0 && (
              <div className="mt-2 flex gap-2">
                {filePreviews.map((preview, idx) => (
                  <img
                    key={idx}
                    src={preview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportDisaster;
