const mongoose = require("mongoose");

const acceptedRequestSchema = new mongoose.Schema(
  {
    // requestId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "MentorRequest" },
    teamName: { type: String, required: true },
    projectName: { type: String, required: true },
    teamMembers: [
      {
        name: { type: String, required: true },
        rollno: { type: String },
      },
    ],
    description: { type: String, required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
    mentorName: { type: String, required: true },
  },
  { timestamps: true } // ✅ Added timestamps for createdAt & updatedAt
);

const AcceptedRequest = mongoose.model("AcceptedRequest", acceptedRequestSchema);
module.exports = AcceptedRequest; // ✅ Export using CommonJS
