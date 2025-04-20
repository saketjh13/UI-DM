// models/Alert.js
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  disasterType: String,
  description: String,
  intensity: Number,
  location: {
    type: {
      type: String, // "Point"
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

alertSchema.index({ location: "2dsphere" }); // Important for geospatial queries

export default mongoose.model("Alert", alertSchema);
