require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path"); // ✅ Import path module for serving files

const app = express();

// ✅ Middleware Setup
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.json()); // Enable JSON support

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Atlas connected successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1); // Exit if database connection fails
  });

// ✅ Serve Uploaded Files (e.g., PDFs, images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes = require("./routes/teamRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const projectReportRoutes = require("./routes/projectReportRoutes");
const panelRoutes = require("./routes/panelRoutes");
const remarksRoutes = require("./routes/remarksRoutes");
const marksRoutes = require("./routes/marksRoutes");
const exportRoutes = require("./routes/exportRoutes");
const freezeRoutes = require("./routes/freezeRoutes");
const teamLimitRoutes = require("./routes/teamLimitRoutes");

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/team/freeze", freezeRoutes);
app.use("/api/team-limits", teamLimitRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/notifications", notificationRoutes); 
app.use("/api/submission", submissionRoutes);
app.use("/api/project-report", projectReportRoutes);
app.use("/api/panel", panelRoutes);
app.use("/api/remarks", remarksRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api", exportRoutes);

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
