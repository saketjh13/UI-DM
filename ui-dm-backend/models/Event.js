import mongoose from "mongoose";

// Define the alert data schema
const alertDataSchema = new mongoose.Schema({
  description: { type: String },
  images: [{ type: String }],
  severity: { type: Number },
  location: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

// Define the assignment schema
const assignmentSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  description: { type: String, required: true },
  assignedTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  assignedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
  deploymentLocation: { type: String, required: true },
  photos: [{ type: String }],
}, { _id: false }); // Use _id: false since assignments are embedded, not referenced as a separate model

// Define the event schema
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  intensity: { type: String }, // Optional, good to keep

  // Update assignments to be embedded documents, not references
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  }],
  

  alertData: [alertDataSchema],

  // ✅ Optional: Track report IDs used for this event
  reportIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],

  // ✅ Marked userDetails as optional
  userDetails: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    contactInfo: {
      email: { type: String },
      phone: { type: String },
    },
  },

}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
