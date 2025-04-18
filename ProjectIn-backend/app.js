require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path"); // ✅ Import path module for serving files
// const sendEmail = require("../utils/emailService"); // Import email service
const MentorRequest = require("./models/MentorRequest");
const Student = require("./models/Student");
const sendEmail = require("./utils/emailService");
const FreezeStatus = require("./models/FreezeStatus");

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

// import models
const Notification = require("./models/Notification");

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const authoneRoutes = require("./routes/authoneRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes = require("./routes/teamRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const projectReportRoutes = require("./routes/projectReportRoutes");
const panelRoutes = require("./routes/panelRoutes");
const remarksRoutes = require("./routes/remarksRoutes");
const marksRoutes = require("./routes/marksRoutes");
const exportRoutes = require("./routes/exportRoutes");
const freezeRoutes = require("./routes/freezeRoutes");
const teamLimitRoutes = require("./routes/teamLimitRoutes");
const studentRoutes = require("./routes/studentRoutes");
const coordinatorRoutes = require("./routes/coordinatorRoutes"); // ✅ Added Coordinator Routes
const requestRoutes = require("./routes/requestRoutes");
const acceptedTeamsRoutes = require("./routes/acceptedTeamsRoutes");
const reviseRequestRoutes = require("./routes/reviseRequestRoutes");
const mentormeetRoutes = require("./routes/mentormeet");
const evaluationRoutes = require("./routes/evaluationRoutes");
const AcceptedTeam = require("./models/AcceptedRequest");
const mentorToken = require("./middlewares/mentorMiddleware");
const flushRoutes = require("./routes/flushRoutes");
// const emailRoutes = require("./routes/emailRoutes"); // Import email routes

//const projectRoutes = require("./routes/projectRoutes");

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/authone", authoneRoutes);
app.use("/api/projects", projectRoutes);
console.log("✅ Registering Team Routes at /api/team");
app.use("/api/team", teamRoutes);
app.use("/api/team-freeze", freezeRoutes);
app.use("/api/team-limits", teamLimitRoutes);
console.log("✅ Team Limits routes registered at /api/team-limits");
app.use("/api/mentor",teacherRoutes);
app.use("/api/notifications", notificationRoutes);
console.log("Notification routes loaded!");  
app.use("/api/submission", submissionRoutes);
app.use("/api/project-report", projectReportRoutes);
app.use("/api/panel", panelRoutes);
app.use("/api/remarks", remarksRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api", exportRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/coordinators", coordinatorRoutes);
app.use("/api/mentor-requests", requestRoutes);
app.use("/api/accepted-requests", acceptedTeamsRoutes);
app.use("/api/revised-requests", reviseRequestRoutes);
app.use("/api/mentormeets", mentormeetRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/app", projectRoutes);
app.use("/api", flushRoutes);
// app.use("/api/send-email", emailRoutes); // Use email routes
console.log("✅ Email routes loaded successfully!"); // Debug log


// Store Accepted Requests
app.post("/api/accepted-requests", async (req, res) => {
  console.log("📥 Received data:", req.body);
  const { teamName, projectName, teamMembers, description } = req.body;

  if (!teamName || !projectName || !teamMembers || !description) {
    return res.status(400).json({ error: "Missing required fields", received: req.body });
  }

  try {
    const newAcceptedTeam = new AcceptedTeam({
      teamName,
      projectName,
      teamMembers,
      description,
    });
    await newAcceptedTeam.save();
    res.status(201).json(newAcceptedTeam);
  } catch (error) {
    console.error("❌ Backend Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/send-email", async (req, res) => {
  console.log("✅ Email API Hit!"); // Debugging
  console.log("Received Data:", req.body); // Debugging
  
  const { email, subject, message, projectName, action } = req.body; 
  console.log("Email:", email);
  console.log("Subject:", subject);
  console.log("Message:", message);
  console.log("Project Name:", projectName);
  console.log("Action:", action);

  // Validate if projectName exists
  if (!projectName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!email || !subject || !message) {
    return res.status(400).json({ error: "Missing email, subject, or message" });
  }

  try {

    // 4️⃣ Prepare email details
    let emailSubject = "";
    let emailMessage = "";

    switch (action) {
      case "Accepted":
        emailSubject = `Project "${projectName}" Accepted! 🎉`;
        // emailMessage = `Your project "${projectName}" has been accepted by the mentor.`;
        emailMessage = `"${message}"`
        break;
      case "Rejected":
        emailSubject = `Project "${projectName}" Rejected 😞`;
        // emailMessage = `Unfortunately, your project "${projectName}" has been rejected. Please contact your mentor for further details.`;
        emailMessage = `"${message}"`
        break;
      case "Revised":
        emailSubject = `Project "${projectName}" Needs Revision ✍️`;
        // emailMessage = `Your project "${projectName}" has been marked for revision. Please check your dashboard for required changes.`;
        emailMessage = `"${message}"`
        break;
      default:
        return res.status(400).json({ error: "Invalid action" });
    }

    // 5️⃣ Send the email
    await sendEmail(email, emailSubject, emailMessage);

    res.status(200).json({ message: `Email sent successfully to ${email}` });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ✅ Define the POST /api/notifications/add route
app.post("/api/notifications/add", async (req, res) => {
  console.log("✅ POST /api/notifications/add triggered!"); // Log to confirm request is received

  const { message } = req.body;
  if (!message) {
    console.log("❌ Missing message field in request body");
    return res.status(400).json({ success: false, error: "Message is required" });
  }

  try {
    const newNotification = new Notification({ message });
    await newNotification.save();
    console.log("✅ Notification saved successfully!");
    res.status(201).json({ success: true, message: "Notification added!" });
  } catch (error) {
    console.error("❌ Error saving notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// update-progress api
app.post("/api/team/update-progress", async (req, res) => {
  const { teamID, step } = req.body;

  try {
    const team = await Team.findOne({ teamID });
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });

    team.progressStatus[step] = true;
    await team.save();

    res.json({ success: true, message: `${step} form submitted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

app.post("/api/team-freeze/remove-freeze", async (req, res) => {
  try {
    let freezeStatus = await FreezeStatus.findOne();

    if (freezeStatus) {
      freezeStatus.isFrozen = false;
      await freezeStatus.save();
    }
    
    res.json({ message: "Freeze has been removed successfully!", isFrozen: false });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove freeze status" });
  }
});

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