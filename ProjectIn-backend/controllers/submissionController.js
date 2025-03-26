const Submission = require("../models/submissionModel");
const SubmissionRequest = require("../models/SubmissionRequest");
const multer = require("multer");
const path = require("path");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});

const upload = multer({ storage });

// Function to handle submission
const submitProject = async (req, res) => {
  try {
    const { isResearchBased } = req.body;
    const isResearch = isResearchBased === "yes"; // Convert to boolean

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // **Conditionally check which files are required**
    if (isResearch && !req.files.synopsis) {
      return res.status(400).json({ message: "Synopsis file is required for research-based projects" });
    }
    if (!isResearch && (!req.files.srs || !req.files.sds)) {
      return res.status(400).json({ message: "SRS and SDS files are required for non-research-based projects" });
    }

    // Create a new submission entry
    const newSubmission = new Submission({
      submittedBy: req.user.id,
      isResearchBased: isResearch,
      synopsis: isResearch ? req.files.synopsis[0].path : null,
      srs: !isResearch ? req.files.srs[0].path : null,
      sds: !isResearch ? req.files.sds[0].path : null,
    });

    await newSubmission.save();
    res.status(201).json({ message: "Project submitted successfully!" });
  } catch (error) {
    console.error("Error submitting project:", error);
    res.status(500).json({ message: "Server error while submitting project" });
  }
};
const createSubmissionRequest = async (req, res) => {
  try {
    const { submissionType, deadlineDate } = req.body;

    if (!submissionType || !deadlineDate) {
      return res.status(400).json({ error: "Both submission type and deadline date are required." });
    }

    const newSubmission = new SubmissionRequest({
      submissionType,
      deadlineDate,
    });

    await newSubmission.save();
    res.status(201).json({ message: "Submission request created successfully!", submission: newSubmission });
  } catch (error) {
    console.error("Error creating submission request:", error);
    res.status(500).json({ error: "Failed to create submission request" });
  }
};

// ✅ Fetch all submission requests
const getAllSubmissionRequests = async (req, res) => {
  try {
    const submissions = await SubmissionRequest.find();
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submission requests:", error);
    res.status(500).json({ error: "Failed to fetch submission requests" });
  }
};

// ✅ Delete a submission request
const deleteSubmissionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await SubmissionRequest.findByIdAndDelete(id);
    res.json({ message: "Submission request deleted successfully!" });
  } catch (error) {
    console.error("Error deleting submission request:", error);
    res.status(500).json({ error: "Failed to delete submission request" });
  }
};


module.exports = { upload, submitProject,createSubmissionRequest,
  getAllSubmissionRequests,
  deleteSubmissionRequest, };
