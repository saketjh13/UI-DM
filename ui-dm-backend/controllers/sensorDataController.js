import mongoose from "mongoose";

// Get recent sensor alerts (fire, gas leak, earthquake, smoke etc.)
export const getRecentSensorAlerts = async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection("sensor_data");

    const alerts = await collection.find({
      $or: [
        { "data.fire": true },
        { "data.gas_leak": true },
        { "data.smoke": true },
        { "data.earthquake": true },
      ]
    })
    .sort({ timestamp: -1 })
    .limit(10)
    .toArray();

    res.json(alerts);
  } catch (error) {
    console.error("Error fetching recent sensor alerts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all sensor data (optional if you want to view everything)
export const getAllSensorData = async (req, res) => {
  try {
    const collection = mongoose.connection.db.collection("sensor_data");

    const allData = await collection.find({})
      .sort({ timestamp: -1 })
      .toArray();

    res.json(allData);
  } catch (error) {
    console.error("Error fetching all sensor data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific sensor data by ID
export const getSensorDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = mongoose.connection.db.collection("sensor_data");

    const data = await collection.findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!data) {
      return res.status(404).json({ message: "Sensor data not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching sensor data by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
