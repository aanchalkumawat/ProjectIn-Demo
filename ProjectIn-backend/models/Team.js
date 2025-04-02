const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamID: { type: String, required: true, unique: true },
  domain: { type: String, required: false, default: "Web-Development" },
  teamLeader: {
    fullName: { type: String, required: true },
    enrollmentNumber: { type: String, required: true },
    email: { type: String, required: false },
    phoneNumber: { type: String, required: true },
    subject: { type: String, required: true }
  },
  teamSize: { type: Number, required: true },
  teamMembers: [
    {
      fullName: { type: String, required: true },
      enrollmentNumber: { type: String, required: true },
      subject: { type: String, required: true },
      email: { type: String, required: true },
      status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" }
    },
  ],
  isNotified: { type: Boolean, default: false },

  // ✅ Tracking only 5 form submissions instead of 11 steps
  progressStatus: {
    teamFormation: { type: Boolean, default: false },   // Form 1
    mentorAllocation: { type: Boolean, default: false }, // Form 2
    projectDetailSubmission: { type: Boolean, default: false }, // Form 3
    submission1: { type: Boolean, default: false }, // Form 4
    submission2: { type: Boolean, default: false }  // Form 5
  }
});

module.exports = mongoose.model("Team", TeamSchema);
