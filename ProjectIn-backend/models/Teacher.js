const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model("Teacher", teacherSchema);

