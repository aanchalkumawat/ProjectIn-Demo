const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isResearchBased: {
    type: Boolean,
    required: true,
  },
  synopsis: {
    type: String, // File path
  },
  srs: {
    type: String, // File path
  },
  sds: {
    type: String, // File path
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
