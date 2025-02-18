const ProjectReport = require("../models/ProjectReport");

// ✅ Handle Project Report Submission
const submitProjectReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a project report file." });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newReport = new ProjectReport({
      submittedBy: req.user.id,
      filePath: req.file.path, // Store the file path in DB
    });

    await newReport.save();
    res.status(201).json({ message: "Project report submitted successfully!" });
  } catch (error) {
    console.error("Error submitting project report:", error);
    res.status(500).json({ message: "Server error while submitting project report" });
  }
};

module.exports = { submitProjectReport };
