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

module.exports = { getTeamStats };
