// models/ResourceRequest.js
import mongoose from "mongoose";

const ResourceRequestSchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      required: true,
      enum: ["Medical", "Food", "Shelter", "Ambulance"], // Still expandable
    },
    resourceName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    teamId: {
      type: String, // 🔥 NOT ObjectId anymore, just a string like "1234"
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const ResourceRequest = mongoose.model("ResourceRequest", ResourceRequestSchema);

export default ResourceRequest;
