import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // ⬅️ Needed for socket.io
import { Server } from "socket.io"; // ⬅️ Add this
import sensorDataRoutes from "./routes/sensorDataRoutes.js";
import resourceRequestRoutes from "./routes/resourceRequestRoute.js";



// Route imports
import authRoutes from "./routes/authRoute.js";
import eventRoute from "./routes/eventRoute.js";
import reportRoutes from "./routes/reportRoute.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import taskRoutes from "./routes/taskRoute.js";

import { watchSensorData } from './utils/sensorWatcher.js'; // Sensor watcher

// Controller & middleware
import { getAlertsByArea } from "./controllers/alertController.js";
import authenticate from "./middleware/authenticate.js";

dotenv.config();

const app = express();
const server = http.createServer(app); // ⬅️ Use HTTP server manually
const io = new Server(server, {
  cors: {
    origin: "*", // Loosen up for dev, restrict later
  }
});

// 🔥 Make socket.io globally available
global._io = io;

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
app.use("/api/", taskRoutes);
app.use("/api/sensor-data", sensorDataRoutes);
app.use("/api/request-resource", resourceRequestRoutes);

// ===== Additional Custom Route =====
app.get("/api/alerts/area", authenticate, getAlertsByArea); // custom authenticated route

// ===== Connect to MongoDB and Start Server =====
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // 🚀 Start Sensor Watcher AFTER DB is ready
    await watchSensorData(); 

    server.listen(PORT, () => 
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// ====== Optional: Basic socket connection log =====
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);
});
