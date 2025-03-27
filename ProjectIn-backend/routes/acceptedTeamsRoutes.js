const express = require("express");
const AcceptedTeam = require("../models/AcceptedRequest.js"); // Ensure correct model
const MentorRequest = require("../models/MentorRequest.js");

const router = express.Router();

// ✅ Route to accept a team and save it to the database
router.post("/", async (req, res) => {
  try {
    const { teamName, projectName, description, teamMembers, mentorId, mentorName } = req.body;

    if (!teamName || !projectName || !mentorId || !mentorName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the team already exists in the accepted collection
    const existingTeam = await AcceptedTeam.findOne({ projectName });
    if (existingTeam) {
      return res.status(409).json({ error: "Team is already accepted" });
    }

    // Create a new accepted team entry
    const acceptedTeam = new AcceptedTeam({
      teamName,
      projectName,
      description,
      teamMembers: teamMembers || [],
      mentorId,
      mentorName,
      acceptedAt: new Date(), // ✅ Store the acceptance date
    });

    await acceptedTeam.save();
    
    // ✅ Delete the corresponding mentor request by projectName
    // const deletedRequest = await MentorRequest.findOneAndDelete({ projectName });
    // if (!deletedRequest) {
    //   console.warn(`⚠️ No mentor request found for project: ${projectName}`);
    // }

    res.status(201).json({ message: "Team accepted successfully", acceptedTeam });
  } catch (error) {
    console.error("❌ Error accepting team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Define the route to fetch accepted teams
router.get("/", async (req, res) => {
  const { mentorId } = req.query; // Extract mentorId from query params

  try {
    let query = {};

    // If mentorId is provided, filter results
    if (mentorId) {
      query.mentorId = mentorId;
    }
    const acceptedTeams = await AcceptedTeam.find(query).sort({ acceptedAt: -1 }); // Sort by latest accepted first
    if (acceptedTeams.length === 0) {
      return res.status(404).json({ message: "No accepted teams found." });
    }
    res.json(acceptedTeams);
  } catch (error) {
    console.error("❌ Error fetching accepted teams:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
