const express = require("express");
const RevisedRequest = require("../models/RevisedRequest");
const MentorRequest = require("../models/MentorRequest");

const router = express.Router();

// ✅ POST request to store a revised request
router.post("/", async (req, res) => {
  try {
    const { requestId, projectName, teamMembers, description } = req.body;

    // ✅ Improved validation checks
    if (!projectName || !teamMembers || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Create a new revised request entry
    const revisedRequest = new RevisedRequest({
      projectName,
      teamMembers,
      description,
    });

    await revisedRequest.save(); // ✅ Save revised request

    // ✅ Remove the request from MentorRequest collection based on projectName
    const deletedRequest = await MentorRequest.findOneAndDelete({ projectName });

    if (!deletedRequest) {
      return res.status(404).json({ message: "No matching request found to delete." });
    }

    res.status(201).json({ message: "Request moved to revise-requests successfully!" });
  } catch (error) {
    console.error("Error moving request to revise-requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router; // ✅ Export using CommonJS
