const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  groupID: { type: String, required: true },
  mentorName: { type: String, required: true },
  domain: { type: String, required: true },
  description: { type: String, required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Project", ProjectSchema);
