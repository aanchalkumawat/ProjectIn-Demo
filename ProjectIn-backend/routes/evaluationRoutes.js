const express = require("express");
const Panel = require("../models/Panel.js");
const Team = require("../models/Team.js");
const mentorToken = require("../middlewares/mentorMiddleware.js"); // Ensure this middleware extracts `mentorId` from the token

const router = express.Router();

// Get Assigned Teams
const mongoose = require("mongoose");

router.get("/", mentorToken, async (req, res) => {
  try {
    console.log("✅ Evaluation route is working");
    console.log("Authorization Header:", req.headers.authorization);

    const mentorId = req.user.id; // Extract mentorId from token
    console.log("Mentor ID from Token:", mentorId);

    // Find panels where the logged-in mentor is assigned
    const panel = await Panel.findOne({ teacher_ids: mentorId }).lean();

    if (!panel) {
      return res.status(404).json({ message: "No panel found for this mentor." });
    }

    console.log("Panel Found:", panel);

    // Extract all team_ids
    let teamIds = panel.team_ids || [];
    console.log("Team IDs:", teamIds);

    if (teamIds.length === 0) {
      return res.status(200).json({ message: "No teams assigned to this panel.", teams: [] });
    }

    // Ensure teamIds are ObjectId
    const teamObjectIds = teamIds.map(id => new mongoose.Types.ObjectId(id));

    console.log("🔍 Querying MongoDB with:", { _id: { $in: teamObjectIds } });

    // Find corresponding teams
    const teams = await Team.find({ _id: { $in: teamObjectIds } }).lean();

    console.log("✅ Teams Found:", teams);

    res.status(200).json({ teams });

  } catch (error) {
    console.error("❌ Error fetching assigned teams:", error);
    res.status(500).json({ message: "Failed to fetch assigned teams" });
  }
});

module.exports = router;
