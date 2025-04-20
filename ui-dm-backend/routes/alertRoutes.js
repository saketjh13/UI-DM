import express from "express";
import { getAlertsByArea, getAlertById } from "../controllers/alertController.js";
const router = express.Router();

// Nearby alerts based on location
router.get("/nearby", getAlertsByArea);

// Alert by ID
router.get("/:id", getAlertById);

export default router;
