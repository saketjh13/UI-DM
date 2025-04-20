import Report from "../models/Report.js";
import { clusterReportsByLocation } from "../utils/clusterReports.js"; // ✅ Correct import
import Event from "../models/Event.js";
// Controller to fetch grouped reports
export const getGroupedReports = async (req, res) => {
  try {
    console.log("🔍 Calling clusterReportsByLocation...");
    const grouped = await clusterReportsByLocation();
    console.log("✅ Grouped result:", grouped);
    res.status(200).json(grouped);
  } catch (err) {
    console.error("❌ Error in getGroupedReports:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Submit a disaster report
export const createReport = async (req, res) => {
  try {
    const {
      disasterType,
      intensity,
      description,
      latitude,
      longitude,
      landmark,
      requests,
    } = req.body;

    if (!disasterType || !intensity || !description || !latitude || !longitude) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const parsedRequests = typeof requests === "string" ? JSON.parse(requests) : requests;
    const mediaUrls = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const newReport = new Report({
      disasterType,
      intensity,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      landmark,
      requests: parsedRequests,
      mediaUrls,
      sender: req.user.id, // ✅ Track who submitted
    });

    await newReport.save();

    res.status(201).json({ message: "Report submitted successfully", report: newReport });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get reports by the currently logged-in user

export const getReportsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log(userId)
    const reports = await Report.find({ sender: userId }).sort({ createdAt: -1 });
    // console.log(reports)
    const enrichedReports = await Promise.all(
      reports.map(async (report) => {
        const event = await Event.findOne({ reportIds: report._id })
          .populate({
            path: "assignments",
            populate: ["assignedTeams", "assignedResources"],
          });
          // console.log("Event",event)
    // console.log(event)

        return {
          report,
          event: event ? {
            _id: event._id, 
            name: event.name,
            assignments: event.assignments,
          } : null,
        };
      })
    );
    res.status(200).json(enrichedReports);
  } catch (error) {
    console.error("Error fetching user reports with events:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate("sender", "name"); // ✅ Populate sender info
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate("sender", "name email role");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Server error" });
  }
};
