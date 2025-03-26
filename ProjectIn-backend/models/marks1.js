const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema({
  enrollmentNumber: { type: String, required: true, unique: true }, // Unique student identifier
  fullName: { type: String, required: true },
  marks: { type: Number, required: true, min: 0, max: 100 }, // Marks out of 100
});

module.exports = mongoose.model("Marks", MarksSchema);
