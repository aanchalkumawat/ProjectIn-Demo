const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  expertise: { type: String }, // Add expertise fields if needed
  password: { type: String, required: true },
  phone: { type: String },
});

module.exports = mongoose.model("Mentor", mentorSchema);
