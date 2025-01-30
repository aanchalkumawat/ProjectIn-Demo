const mongoose = require("mongoose");

const mentorRequestSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  isResearchBased: { type: Boolean, required: true },
  projectDescription: { type: String, required: true },
  technologyDetails: { type: String, required: true },
  members: [
    {
      name: { type: String, required: true },
      rollno: { type: String, required: true },
      phone: { type: String },
    },
  ],
  mentorName: { type: String, required: true },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, default: "Pending" }, // Pending, Approved, Rejected
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MentorRequest", mentorRequestSchema);
