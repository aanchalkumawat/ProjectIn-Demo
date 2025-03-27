const mongoose = require("mongoose");

const RevisedRequestSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  teamMembers: [
    {
      name: { type: String, required: true },
      rollNo: { type: String, required: true },
    }
  ],
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const RevisedRequest = mongoose.model("RevisedRequest", RevisedRequestSchema);
module.exports = RevisedRequest; // ✅ Export using CommonJS
