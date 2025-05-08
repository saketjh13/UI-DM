import express from "express";
import {
  createResourceRequest,
  getAllResourceRequests,
  getRequestsByTeam,
  updateRequestStatus,
} from "../controllers/resourceRequestController.js";
const router = express.Router();

// Create a new resource request (responder)
router.post("/", createResourceRequest);

// Get all resource requests (admin)
router.get("/", getAllResourceRequests);

// Get requests by team ID (responder)
router.get("/team/:teamId", getRequestsByTeam);

// Update request status (admin approves/rejects)
router.put("/status/:requestId", updateRequestStatus);

import ResourceRequest from "../models/ResourceRequest.js";
import Team from "../models/Team.js";
import Resource from "../models/Resource.js";
import Task from "../models/Task.js"

// POST /api/resource-requests/from-request/:requestId
router.post("/from-request/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;

    // 1. Fetch the resource request
    const request = await ResourceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Resource request not found" });
    }

    // 2. Fetch the associated team using teamId
    const team = await Team.findOne({ teamId: request.teamId });
    if (!team) {
      return res.status(404).json({ message: "Associated team not found" });
    }

    // 3. Prepare data with optional overrides from req.body
    const quantity = req.body.quantity || request.quantity;
    const name = req.body.name || request.resourceName;
    const type = req.body.type || request.resourceType;
    const location = req.body.location || team.location;

    // 4. Create the resource
    const newResource = new Resource({ name, type, quantity, location });
    await newResource.save();
    const task = await Task.findById(request.taskId);
    if (!task) {
      return res.status(404).json({ message: "Associated task not found" });
    }

    if (!task.assignedResources) {
      task.assignedResources = [];
    }

    task.assignedResources.push(newResource._id);
    await task.save();

    if (quantity >= request.quantity) {
      await ResourceRequest.findByIdAndDelete(request._id);
    } else {
      request.quantity -= quantity;
      request.status = "Approved";// Partial fulfillment
    }
    // 5. Mark the original request as approved
    // request.status = "Approved";
    // await request.save();
    res.status(201).json({
      message: "Resource created and request approved",
      resource: newResource,
    });
  } catch (error) {
    console.error("Error fulfilling resource request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
