const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  enrollmentNumber: { type: String, unique: true, required: true },  // ✅ Add this field
  subject: { type: String, required: true } // ✅ Add subject for dropdown validation
});

module.exports = mongoose.model("Student", studentSchema);