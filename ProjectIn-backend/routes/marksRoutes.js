const express = require("express");
const { assignMarks , getStudentMarks} = require("../controllers/marksControllers");

const router = express.Router();
router.post("/fetch", getStudentMarks);
router.post("/assign", assignMarks);

module.exports = router;
