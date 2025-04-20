import Team from "../models/Team.js";
import { v4 as uuidv4 } from 'uuid'; // Top of the file
export const createTeam = async (req, res) => {
  try {
    const { teamId, name, type, captain, location, members } = req.body;

    if (!name || !type || !captain || !location || !members || !Array.isArray(members)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newTeam = new Team({
      teamId: teamId || uuidv4(), // 🔥 Accept from frontend or auto-gen
      name,
      type,
      captain,
      location,
      members,
    });

    await newTeam.save();
    res.status(201).json({ message: "Team created successfully", team: newTeam });
  } catch (error) {
    console.error("Create team error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get team by teamId (for responder login)
export const getTeamByTeamId = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findOne({ teamId });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Task Result (for captains only)
export const updateTaskResult = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { taskId, result } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (req.user.id !== team.captain.toString()) {
      return res.status(403).json({ message: "Only the Team Captain can update task results" });
    }

    // TODO: Update actual task result logic
    res.json({ message: "Task result updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all teams
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
