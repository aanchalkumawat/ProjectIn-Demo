const express = require("express");
const router = express.Router();
const { exportTeamDetails } = require("../controllers/exportController"); // ✅ Import Controller

// ✅ Define Export Route
router.get("/export-team-details", exportTeamDetails);

module.exports = router;
