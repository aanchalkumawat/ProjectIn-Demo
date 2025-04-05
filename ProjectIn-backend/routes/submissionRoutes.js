const express = require("express");
const multer = require("multer");
const {
  submitProject,
  createSubmissionRequest,
  getAllSubmissionRequests,
  deleteSubmissionRequest,
  getActiveDeadlines,
} = require("../controllers/submissionController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // File storage

// Existing routes:
router.post("/", verifyToken, upload.fields([
  { name: "synopsis", maxCount: 1 },
  { name: "srs", maxCount: 1 },
  { name: "sds", maxCount: 1 }
]), submitProject);

router.post("/create", verifyToken, createSubmissionRequest);
router.get("/all", verifyToken, getAllSubmissionRequests);
router.delete("/:id", verifyToken, deleteSubmissionRequest);

// ✅ New Route: Fetch active deadline for a submission type
router.get("/active", /*verifyToken,*/ getActiveDeadlines);

module.exports = router;
