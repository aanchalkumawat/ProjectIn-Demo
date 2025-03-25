const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamID: { type: String, required: true, unique: true },
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
      subject: { type: String, required: true }, // ✅ Kept the subject field
      email: { type: String, required: true }, // ✅ Email field added for notifications
      status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" } // ✅ Accept/Reject Status field
    },
  ],
  isNotified: { type: Boolean, default: false }
});

module.exports = mongoose.model("Team", TeamSchema);
