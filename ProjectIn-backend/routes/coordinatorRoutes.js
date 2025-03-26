const express = require("express");
const { upload, importCoordinators } = require("../controllers/coordinatorController");

const router = express.Router();

// ✅ Route to Import Coordinators from Excel
router.post("/import", upload.single("file"), importCoordinators);

module.exports = router;
