import express from "express";
import { getRecentSensorAlerts, getAllSensorData, getSensorDataById } from "../controllers/sensorDataController.js";

const router = express.Router();

// GET recent alerts
router.get("/alerts/recent", getRecentSensorAlerts);

// GET all sensor data
router.get("/", getAllSensorData);

// GET single sensor data by ID
router.get("/:id", getSensorDataById);

export default router;
