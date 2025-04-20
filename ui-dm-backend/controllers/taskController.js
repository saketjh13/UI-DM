import Event from "../models/Event.js";
import Task from '../models/Task.js';
import Team from '../models/Team.js'
// ✅ Get all tasks assigned to a specific responder
export const getResponderTasks = async (req, res) => {
  try {
    const { responderId } = req.params;

    const tasks = await Task.find({ responder: responderId })
      .populate("assignedTeams")
      .populate("assignedResources");

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch responder tasks", error: err.message });
  }
};

// ✅ Update task status, notes, and photos
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, note, photo } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (status) task.status = status;
    if (note) task.statusNotes.push(note);
    if (photo) task.photos.push(photo); // image URL or base64 string

    await task.save();

    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err.message });
  }
};

// ✅ Get tasks for a responder using employeeID from teams
export const getTasksForResponder = async (req, res) => {
  try {
    const { employeeID } = req.params;

    const tasks = await Task.find({
      "assignedTeams": {
        $elemMatch: { responderID: employeeID }
      }
    }).populate("assignedTeams assignedResources");

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks for responder:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Add a new task to an event
export const addTaskToEvent = async (req, res) => {
  console.log(req.body);
  try {
    const { eventId } = req.params;
    const {
      task,
      description,
      assignedTeams, // array of team ObjectIds
      assignedResources,
      deploymentLocation,
      photos,
    } = req.body;

    // Validate required fields
    if (!assignedTeams || !Array.isArray(assignedTeams) || assignedTeams.length === 0) {
      return res.status(400).json({ message: "assignedTeams is required and should be a non-empty array" });
    }

    // Fetch the first team's teamId
    const teamObj = await Team.findById(assignedTeams[0]);

    if (!teamObj || !teamObj.teamId) {
      return res.status(404).json({ message: "Assigned team not found or teamId missing" });
    }
    console.log(teamObj);
    // Now safely assign everything
    const newTask = new Task({
      task,
      description,
      assignedTeams,
      assignedResources,
      deploymentLocation,
      photos,
      assignedTeamId: teamObj.teamId, // this should now be defined
    });

    const savedTask = await newTask.save();

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.assignments.push(savedTask._id);
    await event.save();

    res.status(201).json({ message: "Task added to event", task: savedTask });

  } catch (err) {
    console.error("🔥 Error adding task:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ✅ Get all tasks linked to all events
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTeams assignedResources");
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get all assignments (task references) for a single event
export const getAllAssignmentsFromEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate({
      path: "assignments",
      populate: [{ path: "assignedTeams" }, { path: "assignedResources" }],
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json(event.assignments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update a task (full update)
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updatedData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, {
      new: true,
    });

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err.message });
  }
};

// ✅ Delete a task and remove from event
export const deleteTaskFromEvent = async (req, res) => {
  try {
    const { eventId, taskId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.assignments = event.assignments.filter(id => id.toString() !== taskId);
    await event.save();

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "Task deleted and unlinked from event" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
};
export const getEventsForResponder = async (req, res) => {
  try {
    const { teamID } = req.params;

    // Step 1: Find tasks where assignedTeamId matches the provided teamID
    const tasks = await Task.find({ responder: teamID });

    if (tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found for this team", events: [] });
    }

    // Step 2: Extract all task IDs
    const taskIds = tasks.map(task => task._id);

    // Step 3: Find all events that reference those task IDs
    const events = await Event.find({ assignments: { $in: taskIds } })
  .populate({
    path: 'assignments',
    populate: [
      { path: 'assignedTeams', model: 'Team' },
      { path: 'assignedResources', model: 'Resource' }
    ]
  });

    res.status(200).json(events);
  } catch (error) {
    console.error("🔥 Failed to fetch events for responder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
