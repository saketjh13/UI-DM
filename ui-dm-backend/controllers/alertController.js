import Alert from "../models/Alert.js";

export const getAlertsByArea = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validate presence and convert to numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: "Valid latitude and longitude are required" });
    }

    const alerts = await Alert.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 10000, // 10 km radius
        },
      },
    }).populate("assignedTeam", "name members");

    res.status(200).json(alerts);
  } catch (error) {
    console.error("❌ Error fetching alerts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a specific alert by ID with team details
export const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id)
      .populate("assignedTeam", "name members")
      .populate("reports"); // Optional: if alert links to multiple reports

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.status(200).json(alert);
  } catch (error) {
    console.error("Error fetching alert by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
