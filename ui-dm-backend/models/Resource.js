import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },            // e.g., 'First Aid Kit'
    type: { type: String, required: true },            // e.g., 'Medical', 'Food', etc.
    quantity: { type: Number, required: true, min: 1 },// total stock added by admin
    location: { type: String, required: true },        // storage location
  },
  { timestamps: true }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
