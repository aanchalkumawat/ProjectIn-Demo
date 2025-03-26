const express = require("express");
const multer = require("multer");
const { submitProject } = require("../controllers/submissionController");
const verifyToken = require("../middlewares/authMiddleware");
const {
  createSubmissionRequest,
  getAllSubmissionRequests,
  deleteSubmissionRequest,
} = require("../controllers/submissionController");


const router = express.Router();
const upload = multer({ dest: "uploads/" }); // File storage

// API to handle file submission
router.post("/", verifyToken, upload.fields([
  { name: "synopsis", maxCount: 1 },
  { name: "srs", maxCount: 1 },
  { name: "sds", maxCount: 1 }
]), submitProject);

// ✅ Route to create a submission request
router.post("/create", createSubmissionRequest);

// ✅ Route to fetch all submission requests
router.get("/all", getAllSubmissionRequests);

// ✅ Route to delete a submission request by ID
router.delete("/:id", deleteSubmissionRequest);

module.exports = router;
