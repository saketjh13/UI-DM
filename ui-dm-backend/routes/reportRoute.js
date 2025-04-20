import express from "express";
import {
  createReport,
  getReports,
  getReportById,
  getReportsByUser,
  getGroupedReports, // ✅ For grouped view
} from "../controllers/reportController.js";
import upload from "../middleware/upload.js";
import authenticate from "../middleware/authenticate.js";
import Report from "../models/Report.js";
const router = express.Router();
// GET /api/reports/:citizenId/with-event-status
router.get("/:citizenId/with-event-status", getReportsByUser);

// Create a disaster report (with media uploads)
router.post("/", authenticate, upload.array("files", 5), createReport);

// Get all reports (for admin)
router.get("/", getReports);

// ✅ Get grouped reports (for admin)
router.get("/grouped", authenticate, getGroupedReports);

// ✅ Get reports submitted by the logged-in user (Citizen Dashboard)
router.get("/my-reports", authenticate, getReportsByUser);

// Get a single report by ID (⚠️ Always keep this last!)
// router.get("/:id", getReportById);

export default router;
