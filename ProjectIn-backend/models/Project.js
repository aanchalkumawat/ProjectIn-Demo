const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  groupID: { type:String, ref: "Team", required: true },
  projectName: { type: String, required: true }, // Added Project Name
  mentorName: { type: String, required: true },
  domain: { type: String, required: true },
  description: { type: String, required: true },
  researchBased: { type: Boolean, default: false }, // Added Research-Based field, defaulting to false
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Project", ProjectSchema);
