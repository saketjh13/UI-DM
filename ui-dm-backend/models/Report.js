import mongoose from "mongoose";

// Define the schema for the report
const reportSchema = new mongoose.Schema({
  disasterType: { type: String, required: true },
  intensity: { type: Number, required: true },
  description: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  landmark: { type: String }, // Optional landmark if geolocation is unavailable
  requests: [
    {
      resource: { type: String, required: true }, // e.g., "Medical Kits"
      type: { type: String, required: true }, // e.g., "Shelters", "Food Packets"
      quantity: { type: Number, required: true, min: 1 },
    },
  ], // Array of requested resources
  mediaUrls: [String], // Stores relative paths to uploaded media files
  createdAt: { type: Date, default: Date.now },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Refers to the user submitting the report
});

// Create the model for the report
export default mongoose.model("Report", reportSchema);
