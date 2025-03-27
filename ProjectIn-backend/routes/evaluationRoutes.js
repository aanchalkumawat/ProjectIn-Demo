const express = require("express");
const Panel = require("../models/Panel.js");
const Team = require("../models/Team.js");
const mentorToken = require("../middlewares/mentorMiddleware.js"); // Ensure this middleware extracts `mentorId` from the token

const router = express.Router();

// Get Assigned Teams
router.get("/", mentorToken, async (req, res) => {
  try {
    console.log("✅ Evaluation route is working");
    console.log("Authorization Header:", req.headers.authorization);
    
    const mentorId = req.user.id; // Extract mentorId from token
    console.log("Mentor ID from Token:", mentorId);
    
    // Find panels where the logged-in mentor is assigned
    const panel = await Panel.findOne({ teacher_ids: mentorId });
    
    if (!panel) {
      return res.status(404).json({ message: "No panel found for this mentor." });
    }

    console.log("Panel Found:", panel);
    
    // Extract all team_ids
    const teamIds = panel.team_ids;
    console.log("Team IDs:", teamIds);
    
    // Find corresponding teams
    const teams = await Team.find({ _id: { $in: teamIds } });
    console.log("Teams Found:", teams);
    
    res.status(200).json({ teams });
    
  } catch (error) {
    console.error("Error fetching assigned teams:", error);
    res.status(500).json({ message: "Failed to fetch assigned teams" });
  }
});

module.exports = router;
