const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  pendingInvitations: [
    {
      email: { type: String, required: true },
      status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    },
  ],
  projectTitle: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Team", teamSchema);

