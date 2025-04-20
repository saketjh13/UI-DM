import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
  createTeam,
  updateTaskResult,
  getAllTeams,
  getTeamByTeamId // ✅ added import
} from "../controllers/teamController.js";

const router = express.Router();

// Create a new team
router.post("/", createTeam);

// Update task result (Captain only)
router.put("/:teamId/update-task", authenticate, updateTaskResult);

// Get all teams
router.get("/", getAllTeams);

// ✅ Get team by teamId (for responder login)
router.get("/:teamId", getTeamByTeamId);

export default router;
