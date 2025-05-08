import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Task from '../models/Task.js';
import Team from '../models/Team.js';
import User from '../models/User.js'; // Assuming you have this
import ResourceRequest from '../models/ResourceRequest.js';
export const createEvent = async (req, res) => {
  try {
    const {
      name,
      intensity,
      citizenDescriptions,
      citizenPhotos,
      location,
      assignments,
      reports
    } = req.body;
    // console.log("Req is", req);
    // Validation
    if (!name || !location || !assignments || !Array.isArray(assignments) || !reports) {
      return res.status(400).json({ message: "Missing required fields or invalid format." });
    }

    // Location format check
    if (!/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?((1[0-7]\d)|([1-9]?\d))(\.\d+)?$/.test(location)) {
      return res.status(400).json({ message: "Invalid location format." });
    }

    const validatedAssignments = await Promise.all(assignments.map(async (task) => {
      // Parse deployment location
      const deploymentLocationParts = task.deploymentLocation.split(',').map(coord => parseFloat(coord.trim()));
      if (deploymentLocationParts.length !== 2 || isNaN(deploymentLocationParts[0]) || isNaN(deploymentLocationParts[1])) {
        throw new Error("Invalid deployment location format.");
      }
      const deploymentLocation = { lat: deploymentLocationParts[0], lng: deploymentLocationParts[1] };
      // console.log()
      // Validate assigned teams
      const assignedTeams = await Promise.all(task.assignedTeams.map(async (teamObjectId) => {
        const team = await Team.findById(teamObjectId);
        if (!team) throw new Error(`Team with ObjectId ${teamObjectId} not found.`);
        return team._id;
      }));

      // Convert resource strings to ObjectIds
      const assignedResources = task.assignedResources.map((id) => new mongoose.Types.ObjectId(id));

      // 🔍 Find responder based on first assigned team's `teamId` -> User's `employeeId`
      let responder = null;
      if (assignedTeams.length > 0) {
        const firstTeam = await Team.findById(assignedTeams[0]);
        console.log(firstTeam)
        if (firstTeam && firstTeam.teamId) {
          const user = await User.findOne({ employeeID: firstTeam.teamId });
          if (user) responder = firstTeam.teamId;
        }
      }

      // Build Task object
      const newTaskData = {
        task: task.taskName,
        description: task.description,
        assignedTeams,
        assignedResources,
        deploymentLocation,
        photos: task.photos || [],
        status: 'Pending',
        reportID: reports.map((reportId) => new mongoose.Types.ObjectId(reportId)),
        responder, // 🆕 Assigned responder if found
      };

      const newTask = await Task.create(newTaskData);
      return newTask._id;
    }));

    // Build alertData from reports + citizen info
    const alertData = reports.map((reportId, index) => ({
      description: citizenDescriptions[index] || "No description provided",
      images: citizenPhotos.slice(index * 2, index * 2 + 2),
      severity: parseFloat(intensity) || 5,
      location,
      timestamp: new Date(),
    }));

    // Create the Event
    const event = new Event({
      name,
      location,
      date: new Date(),
      intensity,
      assignments: validatedAssignments,
      alertData,
      reportIds: reports.map((reportId) => new mongoose.Types.ObjectId(reportId)),
    });

    await event.save();
    res.status(201).json(event);

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: error.message || "Failed to create event." });
  }
};




// 📌 Create an event and assign tasks (if provided)
export const createEventWithTasks = async (req, res) => {
  const { name, location, date, description, tasks } = req.body;

  try {
    // ✅ Step 1: Create Event
    const newEvent = new Event({
      name,
      location,
      date,
      description,
    });

    await newEvent.save();

    // ✅ Step 2: Create Tasks (if any)
    let savedTasks = [];
    if (Array.isArray(tasks) && tasks.length > 0) {
      const taskDocs = tasks.map((task) => ({
        name: task.name,
        assignedTeams: task.assignedTeams,
        event: newEvent._id,
        status: "Pending",
      }));

      savedTasks = await Task.insertMany(taskDocs);
    }

    res.status(201).json({ event: newEvent, tasks: savedTasks });
  } catch (error) {
    console.error("Error creating event with tasks:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get all events
export const getEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const events = await Event.find(status ? { status } : {});
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get single event by ID (with populated data)

export const getEventDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch Event
    const event = await Event.findById(id).lean();
    console.log(event)
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Populate teams inside assignments
    const populatedAssignments = await Promise.all(
      event.assignments.map(async (assignment) => {
        const teamDocs = await Team.find({ _id: { $in: assignment.teams } }).lean();
        return {
          ...assignment,
          assignedTeams: teamDocs, // Renaming for clarity
        };
      })
    );

    // Fetch related Resource Requests
    const resourceRequests = await ResourceRequest.find({ eventId: id }).lean();

    // Final structured response
    const response = {
      eventName: event.eventName,
      description: event.description,
      createdAt: event.createdAt,
      location: event.location,
      tasks: populatedAssignments,
      resourceRequests,
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching event details:", err);
    res.status(500).json({ message: "Server error while fetching event details" });
  }
};
// @desc Update an event
export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("assignedTeam", "name").populate("reports", "disasterType");

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Failed to update event", error: error.message });
  }
};

// @desc Delete an event
export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
};
