const mongoose = require("mongoose");

const MentorMeetSchema = new mongoose.Schema({
  teamId: { type: String, required: true }, // Store team ID
  teamName: { type: String, required: true }, // Store team name
  date: { type: String, required: true }, // Store date as string (or use Date type)
  mentorName: { type: String, required: true },
  description: { type: String, required: true },
  teamMembersPresent: { type: Number, required: true },
  teamMemberNames: { type: [String], required: false }, // Array of strings
  grade: { type: String, required: true },
});

const MentorMeet = mongoose.model("MentorMeet", MentorMeetSchema);
module.exports = MentorMeet; // ✅ Export using CommonJS
