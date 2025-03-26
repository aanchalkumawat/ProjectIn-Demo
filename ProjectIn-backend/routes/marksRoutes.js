const express = require("express");
const { assignMarks } = require("../controllers/marksControllers");

const router = express.Router();

router.post("/assign", assignMarks);

module.exports = router;
