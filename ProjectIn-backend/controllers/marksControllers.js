const Marks = require("../models/marks1");
const Team = require("../models/Team"); // Import the Team model

const assignMarks = async (req, res) => {
  try {
    const { students, teamID } = req.body;

    if (!students || students.length === 0 || !teamID) {
      return res.status(400).json({ message: "Students data and Team ID are required" });
    }

    // Fetch the team leader's details from the Team model
    const team = await Team.findOne({ teamID });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Extract team leader's details
    const teamLeader = {
      enrollmentNumber: team.teamLeader.enrollmentNumber,
      fullName: team.teamLeader.fullName,
      marks: null, // Marks input for the leader will be added from frontend
    };

    // Add the team leader to the students array
    const updatedStudents = [teamLeader, ...students];

    // Assign marks to all students, including the leader
    for (const student of updatedStudents) {
      await Marks.findOneAndUpdate(
        { enrollmentNumber: student.enrollmentNumber },
        { fullName: student.fullName, marks: student.marks },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: "Marks assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { assignMarks };
