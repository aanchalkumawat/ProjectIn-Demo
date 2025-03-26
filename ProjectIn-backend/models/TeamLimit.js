const mongoose = require("mongoose");

const teamLimitSchema = new mongoose.Schema({
  maxTeams: { type: Number, required: true },
  minMembers: { type: Number, required: true },
  maxMembers: { type: Number, required: true },
});

module.exports = mongoose.model("TeamLimit", teamLimitSchema);
