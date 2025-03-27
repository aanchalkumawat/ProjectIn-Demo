const express = require("express");
const { assignMarks, getStudentMarks } = require("../controllers/marksControllers");
const marks2 = require("../models/marks2.js");
const Panel = require("../models/Panel.js");
const Team = require("../models/Team.js");
const verifyToken = require("../middlewares/authMiddleware.js"); // Ensure middleware is imported
const mentorToken =require("../middlewares/mentorMiddleware.js");

const router = express.Router();

router.post("/fetch", getStudentMarks);
router.post("/assign", assignMarks);

router.get("/", mentorToken, async (req, res) => {
  try {
    const mentorId = req.user.id;
    const panel = await Panel.findOne({ teacher_ids: mentorId });
    if (!panel) {
      return res.status(404).json({ message: "No panel found for this mentor." });
    }
    const teamIds = panel.team_ids;
    const teams = await Team.find({ _id: { $in: teamIds } });
    res.status(200).json({ teams });
  } catch (error) {
    console.error("Error fetching assigned teams:", error);
    res.status(500).json({ message: "Failed to fetch assigned teams" });
  }
});

// Submit Evaluation 1
router.post("/submit-eval1", mentorToken, async (req, res) => {
  const { rollNo, teamId, evalMarks1 } = req.body;
  const evaluatedBy = req.user.id;

  // Validate required fields
  if (!rollNo || !teamId || evalMarks1 === undefined) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check evalMarks1 range
  if (evalMarks1 < 0 || evalMarks1 > 100) {
    return res.status(400).json({ message: "EvalMarks1 must be between 0 and 100." });
  }

  try {
    // Check for duplicate
    const existingRecord = await marks2.findOne({ rollNo });
    if (existingRecord) {
      return res.status(400).json({ message: "Evaluation 1 already submitted for this roll number." });
    }

    const newMarks = new marks2({
      rollNo,
      teamId,
      evalMarks1,
      evaluatedBy,
    });

    await newMarks.save();
    res.status(201).json({ message: "Evaluation 1 submitted successfully." });
  } catch (error) {
    console.error("Error submitting Evaluation 1:", error);
    res.status(500).json({ message: "Failed to submit Evaluation 1" });
  }
});

// Submit Evaluation 2
router.post("/submit-eval2", mentorToken, async (req, res) => {
  const { rollNo, evalMarks2 } = req.body;

  // Validate required fields
  if (!rollNo || evalMarks2 === undefined) {
    return res.status(400).json({ message: "Roll number and EvalMarks2 are required." });
  }

  // Check evalMarks2 range
  if (evalMarks2 < 0 || evalMarks2 > 100) {
    return res.status(400).json({ message: "EvalMarks2 must be between 0 and 100." });
  }

  try {
    const existingRecord = await marks2.findOne({ rollNo });
    if (!existingRecord) {
      return res.status(400).json({ message: "Submit Evaluation 1 first." });
    }

    // Check if EvalMarks2 is already submitted
    if (existingRecord.evalMarks2 !== undefined) {
      return res.status(400).json({ message: "Evaluation 2 already submitted for this roll number." });
    }

    existingRecord.evalMarks2 = evalMarks2;
    await existingRecord.save();
    res.status(200).json({ message: "Evaluation 2 submitted successfully." });
  } catch (error) {
    console.error("Error submitting Evaluation 2:", error);
    res.status(500).json({ message: "Failed to submit Evaluation 2" });
  }
});

module.exports = router;
