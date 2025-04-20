import express from "express";
import {
  getTasksForResponder,
  getAllTasks,
  addTaskToEvent,
  getResponderTasks,
  updateTaskStatus,
  getEventsForResponder
} from "../controllers/taskController.js";
import Task from "../models/Task.js";
const router = express.Router();

// ADMIN ROUTES
router.post('/events/:eventId/tasks', addTaskToEvent);
router.get("/tasks", getAllTasks);

// (Commented admin assignment routes preserved if needed later)
// router.post("/:eventId/assignments", addAssignmentToEvent);
// router.get("/:eventId/assignments", getAllAssignmentsFromEvent);
// router.put("/:eventId/assignments/:assignmentIndex", updateAssignmentInEvent);
// router.delete("/:eventId/assignments/:assignmentIndex", deleteAssignmentFromEvent);

// 🚨 RESPONDER ROUTES

// Get all tasks assigned to a specific responder
router.get("/assigned/:responderId", getResponderTasks);

// Update task status
router.post("/:taskId/update-status", updateTaskStatus);
router.get("/tasks/responder/:teamID", getEventsForResponder);
router.patch('/tasks/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Find the task by its ID and update the status
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ message: 'Task status updated successfully', task });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;
