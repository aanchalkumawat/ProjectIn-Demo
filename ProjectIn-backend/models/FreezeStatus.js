const mongoose = require("mongoose");

const freezeStatusSchema = new mongoose.Schema({
  isFrozen: { type: Boolean, default: false },
});

module.exports = mongoose.model("FreezeStatus", freezeStatusSchema);
