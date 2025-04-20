import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  description: { type: String },

  assignedTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  assignedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],

  deploymentLocation: {
    lat: { type: Number },
    lng: { type: Number },
  },
  
  
  // 🆕 Assigned Responder (optional — can be filled later)
  responder: { type: Number },

  // 🆕 Task Status (for responder tracking)
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },

  // 🆕 Optional notes + photos from responder
  statusNotes: [{ type: String }],
  photos: [{ type: String }],

  // 🆕 Report ID(s) (references to reports that created the task)
  reportID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }], // Array of Report ObjectIds
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
