const express = require("express");
const MentorMeet = require("../models/MentorMeet.js");

const router = express.Router();

// Route to store meeting details
router.post("/", async (req, res) => {
  try {
    const { teamId, teamName, date, mentorName, description, teamMembersPresent, teamMemberNames, grade } = req.body;
    console.log("📥 Data Received:", req.body); // Debugging step

    // Validate required fields
    if (!teamId || !teamName || !date || !mentorName || !description || !teamMembersPresent || !teamMemberNames || !grade) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new meeting entry
    const newMeeting = new MentorMeet({
      teamId,
      teamName,
      date,
      mentorName,
      description,
      teamMembersPresent: Number(teamMembersPresent),
      teamMemberNames: Array.isArray(teamMemberNames) ? teamMemberNames : teamMemberNames.split(",").map(name => name.trim()),
      grade,
    });

    await newMeeting.save();
    const allMeetings = await MentorMeet.find();
    console.log("📌 All Meetings in DB:", allMeetings);
    console.log("✅ Meeting saved:", newMeeting); // Debugging step

    res.status(201).json({ message: "Meeting scheduled successfully", newMeeting });
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
