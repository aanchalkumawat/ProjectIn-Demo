require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes"); // Corrected path for Authentication routes
const teamRoutes = require("./routes/teamRoutes"); // Team routes
const notificationRoutes = require("./routes/notificationRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON request bodies

// Connect to MongoDB Atlas
mongoose
  //.connect(process.env.MONGO_URI, {
   // useNewUrlParser: true,
   // useUnifiedTopology: true,
  //})
  .connect(process.env.MONGO_URI)

  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err);
    process.exit(1); // Exit the app if the database connection fails
  });

// Routes
app.use("/api/auth", authRoutes); // Authentication endpoints
app.use("/api/team", teamRoutes); // Team-related endpoints
app.use("/api/mentor", mentorRoutes);
app.use("/api", notificationRoutes);

console.log("Registered Routes:");
app._router.stack.forEach((r) => {
  if (r.route) {
    console.log(`- ${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
  }
});

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the ProjectIn API!");

});
app.get("/favicon.ico", (req, res) => res.status(204).end());
// Handle Undefined Routes
app.use((req, res) => {
  console.log("Undefined route accessed:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
