const TeamLimit = require("../models/TeamLimit");

// @desc Get current team limits
// @route GET /api/team-limits
// @access Public
const getTeamLimits = async (req, res) => {
  try {
    const limits = await TeamLimit.findOne();
    if (!limits) return res.status(404).json({ message: "Limits not set" });
    res.json(limits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Set or update team limits
// @route POST /api/team-limits
// @access Admin (Only Coordinators)
const setTeamLimits = async (req, res) => {
  const { maxTeams, minMembers, maxMembers } = req.body;

  if (!maxTeams || !minMembers || !maxMembers) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let limits = await TeamLimit.findOne();

    if (limits) {
      // Update existing record
      limits.maxTeams = maxTeams;
      limits.minMembers = minMembers;
      limits.maxMembers = maxMembers;
    } else {
      // Create new record
      limits = new TeamLimit({ maxTeams, minMembers, maxMembers });
    }

    await limits.save();
    res.json({ message: "Limits updated successfully", limits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTeamLimits, setTeamLimits };
