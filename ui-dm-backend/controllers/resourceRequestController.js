import ResourceRequest from "../models/ResourceRequest.js";

// Create a new resource request
export const createResourceRequest = async (req, res) => {
  try {
    const { resourceType, resourceName, quantity, notes, teamId, eventId, taskId } = req.body;

    if (!resourceType || !resourceName || !quantity || !teamId || !eventId || !taskId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newRequest = new ResourceRequest({
      resourceType,
      resourceName,
      quantity,
      notes,
      teamId,
      eventId,
      taskId,
    });

    await newRequest.save();

    res.status(201).json({ message: "Resource request created successfully.", request: newRequest });
  } catch (error) {
    console.error("Error creating resource request:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Fetch all requests (for admin view)
export const getAllResourceRequests = async (req, res) => {
  try {
    const requests = await ResourceRequest.find()
      .populate("teamId", "name")  // Just getting team name
      .populate("eventId", "name")
      .populate("taskId", "taskName")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching resource requests:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Fetch requests for a specific team (responder side)
export const getRequestsByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required." });
    }

    const teamRequests = await ResourceRequest.find({ teamId }).sort({ createdAt: -1 });

    res.status(200).json(teamRequests);
  } catch (error) {
    console.error("Error fetching team resource requests:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Admin can update status (approve/reject)
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // "Approved" / "Rejected"

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const updatedRequest = await ResourceRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }

    res.status(200).json({ message: "Status updated successfully.", updatedRequest });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Server error." });
  }
};
