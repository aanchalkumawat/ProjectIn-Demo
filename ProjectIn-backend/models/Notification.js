const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  status: { type: String, enum: ["pending", "viewed"], default: "pending" },
});

module.exports = mongoose.model("Notification", notificationSchema);
