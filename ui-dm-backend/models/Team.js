import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., Doctor, Firefighter, Transporter
  employeeId: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
});

const TeamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: { type: String, required: true },
  type: { type: String, required: true },
  captain: { type: String, required: true },
  location: { type: String, required: true },
  members: [teamMemberSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Team", TeamSchema);
