import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["citizen", "responder", "admin"] },
  aadharNumber: {
    type: String,
    required: function () {
      return this.role === "citizen"; // Required for citizens only
    },
  },
  employeeID: {
    type: String,
    required: function () {
      return this.role !== "citizen"; // Required for responders and admins
    },
  },
});

// ✅ Use existing model if already defined, else create it
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
