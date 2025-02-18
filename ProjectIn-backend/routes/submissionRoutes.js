const express = require("express");
const multer = require("multer");
const { submitProject } = require("../controllers/submissionController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // File storage

// API to handle file submission
router.post("/", verifyToken, upload.fields([
  { name: "synopsis", maxCount: 1 },
  { name: "srs", maxCount: 1 },
  { name: "sds", maxCount: 1 }
]), submitProject);

module.exports = router;
