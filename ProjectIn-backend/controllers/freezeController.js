const FreezeStatus = require("../models/FreezeStatus");
exports.getFreezeStatus = async (req, res) => {
  try {
    const freezeStatus = await FreezeStatus.findOne();
    res.json({ isFrozen: freezeStatus ? freezeStatus.isFrozen : false });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch freeze status" });
  }
};
exports.freezeTeams = async (req, res) => {
  try {
    let freezeStatus = await FreezeStatus.findOne();

    if (!freezeStatus) {
      freezeStatus = new FreezeStatus({ isFrozen: true });
    } else {
      freezeStatus.isFrozen = true;
    }

    await freezeStatus.save();
    res.json({ message: "Teams have been frozen successfully!", isFrozen: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to freeze teams" });
  }
};
// @desc Freeze teams (Prevent new entries)
// @route POST /api/teams/freeze
// @access Admin (Only Coordinator)

// @desc Get current freeze status
// @route GET /api/teams/freeze-status
// @access Public