const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { collection: "students" } // ✅ Force Mongoose to use the existing "students" collection
);

module.exports = mongoose.model("students", studentSchema);
