const mongoose = require("mongoose");

const PanelSchema = new mongoose.Schema({
  teacher_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }], // Array of teacher IDs
  team_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // Array of team IDs
  coordinator_id: { type: mongoose.Schema.Types.ObjectId, ref: "Coordinator", required: true }, // Single Coordinator
}, { timestamps: true });

const Panel = mongoose.model("Panel", PanelSchema);
module.exports = Panel;
