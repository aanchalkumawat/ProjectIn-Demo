const mongoose = require("mongoose");

const SubmissionRequestSchema = new mongoose.Schema({
  submissionType: { type: String, required: true },
  deadlineDate: { type: Date, required: true },
}, { timestamps: true });

const SubmissionRequest = mongoose.model("SubmissionRequest", SubmissionRequestSchema);
module.exports = SubmissionRequest;
