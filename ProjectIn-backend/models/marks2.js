const mongoose = require("mongoose");

const marks2Schema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  evalMarks1: {
    type: Number,
    min: 0,
    max: 100,
  },
  evalMarks2: {
    type: Number,
    min: 0,
    max: 100,
  },
  evaluations: [
    {
      mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
      eval1Submitted: {
        type: Boolean,
        default: false,
      },
      eval2Submitted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("marks2", marks2Schema,"marks2")


