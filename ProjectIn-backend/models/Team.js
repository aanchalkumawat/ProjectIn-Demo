const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  projectTitle: { type: String, required: true },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  leaderName: { type: String, required: true },
  leaderEmail: { type: String, required: true },
  leaderRollNo: { type: String, required: true },
  course: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Member IDs
  pendingInvitations: [
    {
      email: { type: String, required: true },
      status: { type: String, enum: ["pending", "accepted", "rejected"], required: true },
    },
  ],
});

module.exports = mongoose.model("Team", TeamSchema);
