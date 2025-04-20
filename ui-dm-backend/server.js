import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Route imports
import authRoutes from "./routes/authRoute.js";
import eventRoute from "./routes/eventRoute.js";
import reportRoutes from "./routes/reportRoute.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import taskRoutes from "./routes/taskRoute.js"; // ✅ New import

// Controller & middleware
import { getAlertsByArea } from "./controllers/alertController.js";
import authenticate from "./middleware/authenticate.js";

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// Serve static files (media uploads)
app.use("/uploads", express.static("uploads"));

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoute);
app.use("/api/reports", reportRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/", taskRoutes); // ✅ New route added

// ===== Additional Custom Route =====
app.get("/api/alerts/area", authenticate, getAlertsByArea); // custom authenticated route

// ===== Connect to MongoDB and Start Server =====
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((error) => console.error("❌ MongoDB connection error:", error));
