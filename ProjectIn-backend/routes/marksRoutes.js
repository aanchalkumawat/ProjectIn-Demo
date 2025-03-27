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



// Submit Evaluation 1
router.post("/submit-eval1", mentorToken, async (req, res) => {
  const { rollNo, teamId, evalMarks1 } = req.body;
  const mentorId = req.user.id;

  try {
    if (evalMarks1 === undefined) {
      return res.status(400).json({ message: "Evaluation 1 marks are required." });
    }

    // Find existing record
    let existingRecord = await marks2.findOne({ rollNo, teamId });

    if (!existingRecord) {
      // If no record exists, create one
      existingRecord = new marks2({
        rollNo,
        teamId,
        evalMarks1,
        evaluations: [{ mentorId, eval1Submitted: true, eval2Submitted: false }],
      });
    } else {
      // Check if mentor has already submitted evalMarks1
      const mentorEval = existingRecord.evaluations.find(
        (e) => e.mentorId.toString() === mentorId
      );

      if (mentorEval && mentorEval.eval1Submitted) {
        return res.status(400).json({ message: "You have already submitted Evaluation 1." });
      }

      // Average the marks
      if (existingRecord.evalMarks1) {
        existingRecord.evalMarks1 = (existingRecord.evalMarks1 + evalMarks1) / 2;
      } else {
        existingRecord.evalMarks1 = evalMarks1;
      }

      // Update or add mentor evaluation
      if (mentorEval) {
        mentorEval.eval1Submitted = true;
      } else {
        existingRecord.evaluations.push({ mentorId, eval1Submitted: true, eval2Submitted: false });
      }
    }

    await existingRecord.save();
    res.status(200).json({ message: "Evaluation 1 submitted successfully!" });
  } catch (error) {
    console.error("Error submitting Evaluation 1:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
// Submit Evaluation 2
router.post("/submit-eval2", mentorToken, async (req, res) => {
  const { rollNo, teamId, evalMarks2 } = req.body;
  const mentorId = req.user.id;

  try {
    if (evalMarks2 === undefined) {
      return res.status(400).json({ message: "Evaluation 2 marks are required." });
    }

    const existingRecord = await marks2.findOne({ rollNo, teamId });

    if (!existingRecord) {
      return res.status(400).json({ message: "No record found. Submit Evaluation 1 first." });
    }

    const mentorEval = existingRecord.evaluations.find(
      (e) => e.mentorId.toString() === mentorId
    );

    if (!mentorEval || !mentorEval.eval1Submitted) {
      return res.status(400).json({ message: "Submit Evaluation 1 before Evaluation 2." });
    }

    if (mentorEval.eval2Submitted) {
      return res.status(400).json({ message: "You have already submitted Evaluation 2." });
    }

    // Average the marks
    if (existingRecord.evalMarks2) {
      existingRecord.evalMarks2 = (existingRecord.evalMarks2 + evalMarks2) / 2;
    } else {
      existingRecord.evalMarks2 = evalMarks2;
    }

    // Update mentor evaluation
    mentorEval.eval2Submitted = true;

    await existingRecord.save();
    res.status(200).json({ message: "Evaluation 2 submitted successfully!" });
  } catch (error) {
    console.error("Error submitting Evaluation 2:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
module.exports = router;
