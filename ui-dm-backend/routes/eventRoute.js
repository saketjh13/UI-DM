import express from "express";
import {
  createEvent,
  getEvents,
  getEventDetails,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { verifyToken } from "../middleware/authenticate.js";
import mongoose from "mongoose";
const router = express.Router();


import Event from "../models/Event.js";
import Task from "../models/Task.js";

// POST route for adding tasks to an event
// router.post('/:eventId/tasks', async (req, res) => {
//   const { eventId } = req.params;
//   const { task, description, assignedTeams, assignedResources, deploymentLocation, assignedTeamId } = req.body;

//   try {
//     const event = await Event.findById(eventId); // Find the event by ID
//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }

//     // Create a new task
//     const newTask = new Task({
//       task,
//       description,
//       assignedTeams,
//       assignedResources,
//       deploymentLocation,
//       assignedTeamId,
//     });

//     // Save the task to the Task collection
//     await newTask.save();

//     // Optionally, you can associate this task with the event if you want
//     event.tasks.push(newTask._id); // Assuming the `Event` model has a tasks array to store task IDs
//     await event.save(); // Save the updated event

//     res.status(200).json({ message: 'Task added successfully', task: newTask });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to add task', error: error.message });
//   }
// });


router.get("/", getEvents);
router.get("/:id", getEventDetails);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
// Get events for a specific responder based on employeeId
// Get all events relevant to a responder team
router.get('/responder/:teamID', async (req, res) => { 
  try {
    const { teamID } = req.params;
    console.log(teamID);
    // Fetch all tasks assigned to the team
    const tasks = await Task.find({ responder: teamID });
    console.log("Tasks found:", tasks); // Ensure multiple tasks are found

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this team.' });
    }

    const taskIds = tasks.map(task => task._id);
    // console.log("Task IDs:", taskIds); // Debug task IDs being passed

    // Fetch events that have these tasks in their assignments
    const events = await Event.find({ assignments: { $in: taskIds } })
      .populate({
        path: 'assignments',
        populate: [
          { path: 'assignedTeams', select: 'name teamId' },
          { path: 'assignedResources', select: 'name quantity' },
        ],
      });

    // console.log("Events found:", events); // Log the full events

    res.status(200).json(events); // Return all events with populated tasks
  } catch (err) {
    console.error('Error fetching responder events:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




export default router;
