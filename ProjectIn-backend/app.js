require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path"); // ✅ Import path module for serving files

// Import Routes
const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const projectReportRoutes = require("./routes/projectReportRoutes");

const app = express();

// ✅ Middleware Setup
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.json()); // Enable JSON support

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1); // Exit if database connection fails
  });

// ✅ Serve Uploaded Files (e.g., PDFs, images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/notifications", notificationRoutes); 
app.use("/api/submission", submissionRoutes);
app.use("/api/project-report", projectReportRoutes);

// ✅ Logging Registered Routes
console.log("\n📌 Registered API Routes:");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`- ${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
  }
});

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🎉 Welcome to the ProjectIn API!");
});

// ✅ Handle Undefined Routes
app.use((req, res) => {
  console.warn("⚠️ Undefined route accessed:", req.originalUrl);
  res.status(404).json({ message: "🚨 Route not found" });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
});
