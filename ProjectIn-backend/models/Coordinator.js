const mongoose = require("mongoose");

const coordinatorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model("Coordinator", coordinatorSchema);
