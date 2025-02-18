const express = require("express");
const { submitProjectReport } = require("../controllers/projectReportController");
const verifyToken = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // ✅ Import upload middleware

const router = express.Router();

// Route to handle project report submission
router.post("/submit", verifyToken, upload.single("reportFile"), submitProjectReport);

module.exports = router;
