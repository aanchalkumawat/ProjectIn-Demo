const Marks = require("../models/marks1");
const Team = require("../models/Team"); // Import the Team model

exports.getStudentMarks = async (req, res) => {
  try {
    const { enrollmentNumbers } = req.body; // Expect an array of enrollment numbers

    const assignedMarks = await Marks.find({ enrollmentNumber: { $in: enrollmentNumbers } });

    res.json(assignedMarks);
  } catch (error) {
    console.error("Error fetching student marks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.assignMarks = async (req, res) => {
  try {
    const { students } = req.body;

    for (const student of students) {
      await Marks.findOneAndUpdate(
        { enrollmentNumber: student.enrollmentNumber },
        {
          fullName: student.fullName,
          marks: student.marks,
        },
        { upsert: true, new: true }
      );
    }

    res.json({ message: "Marks assigned successfully!" });
  } catch (error) {
    console.error("Error assigning marks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
