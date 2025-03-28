const Team = require("../models/Team");
const Student = require("../models/Student"); // ✅ Corrected model name

// @desc Get team and student statistics
// @route GET /api/teams/stats
// @access Public
const getTeamStats = async (req, res) => {
  try {
    // Total number of teams
    const totalTeams = await Team.countDocuments();

    // Total students who formed teams (Sum of all members in teams)
    const teams = await Team.find();
    const totalStudentsInTeams = teams.reduce((sum, team) => sum + (team.teamMembers ? team.teamMembers.length : 0), 0); // ✅ Fixed `teamMembers`

    // Total number of students in the students collection
    const totalStudents = await Student.countDocuments();

    res.json({
      totalTeams,
      totalStudentsWhoFormedTeams: totalStudentsInTeams,
      totalStudents,
    });
  } catch (error) {
    console.error("❌ Error fetching team stats:", error.message);
    res.status(500).json({ error: "Failed to fetch team statistics" });
  }
};

const getGroupIDs = async (req, res) => {
  try {
    const { teamIds } = req.body; // Expecting an array of ObjectIds
    const teams = await Team.find({ _id: { $in: teamIds } }).select("groupID");

    const groupIDs = teams.map((team) => team.groupID); // Extract groupIDs
    res.status(200).json({ groupIDs });
  } catch (error) {
    console.error("❌ Error fetching group IDs:", error);
    res.status(500).json({ error: "Failed to fetch group IDs." });
  }
};
module.exports = { getTeamStats,getGroupIDs };
