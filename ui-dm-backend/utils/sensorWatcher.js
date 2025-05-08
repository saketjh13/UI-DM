import mongoose from 'mongoose';
import Alert from '../models/Alert.js';

export const watchSensorData = async () => {
  console.log("👀 Sensor Watcher (No Schema Mode) Started...");

  const db = mongoose.connection.db;
  const sensorDataCollection = db.collection('sensor_data');

  let lastChecked = new Date();

  setInterval(async () => {
    try {
      const newSensorEntries = await sensorDataCollection.find({
        timestamp: { $gt: lastChecked }
      }).toArray();

      if (newSensorEntries.length) {
        console.log(`📈 Found ${newSensorEntries.length} new sensor entries.`);

        for (const entry of newSensorEntries) {
          const { data } = entry;
          if (!data) continue;

          const {
            disaster,
            gas_leak,
            smoke,
            fire,
            earthquake,
            mq135_value,
            mq7_value,
            accel_magnitude
          } = data;

          // Only create an alert if a real disaster is detected
          if (disaster && disaster !== "None") {
            const sensorType = disaster.charAt(0).toUpperCase() + disaster.slice(1);

            const newAlert = new Alert({
              title: `Sensor-Detected ${sensorType}`,
              description: `Automated detection: GasLeak=${gas_leak}, Smoke=${smoke}, Fire=${fire}, Earthquake=${earthquake}, MQ135=${mq135_value}, MQ7=${mq7_value}, Accel=${accel_magnitude}`,
              location: {
                lat: 0, // 📌 update with actual location if available later
                lng: 0
              },
              images: [],
              type: sensorType,
              source: "sensor",
              intensity: calcIntensity(accel_magnitude),
              timestamp: new Date()
            });

            await newAlert.save();
            console.log(`🚨 New Sensor Alert Created: [${sensorType}]`);

            // 📡 Emit socket event with FULL sensor data
            if (global._io) {
              global._io.emit('new-alert', {
                id: newAlert._id,
                title: newAlert.title,
                description: newAlert.description,
                type: newAlert.type,
                timestamp: newAlert.timestamp,
                location: newAlert.location,
                intensity: newAlert.intensity,
                source: newAlert.source,
                sensorData: {
                  gas_leak,
                  smoke,
                  fire,
                  earthquake,
                  mq135_value,
                  mq7_value,
                  accel_magnitude
                }
              });
              console.log("📡 Socket emitted: new-alert (with sensor data)");
            }
          }
        }
      }

      lastChecked = new Date(); // ⏰ Update checkpoint after processing

    } catch (error) {
      console.error('❌ Sensor Watcher Error:', error.message);
    }
  }, 5000);
};

// 🧠 Helper function to calculate intensity smartly
const calcIntensity = (accel) => {
  if (!accel || accel <= 0) return 1; // Minimum intensity fallback
  return Math.min(Math.round(accel / 2), 10); // You can tweak the formula if needed
};
