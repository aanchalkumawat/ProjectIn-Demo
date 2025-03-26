const express = require("express");
const { upload, importStudents } = require("../controllers/studentControllers");

const router = express.Router();

// ✅ Route to Import Students from Excel
router.post("/import", upload.single("file"), importStudents);

module.exports = router;
