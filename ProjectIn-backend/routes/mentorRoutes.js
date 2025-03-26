const express = require("express");
const { createMentorRequest, /*getMentorRequests,*/fetchMentors } = require("../controllers/mentorController");
const { upload, importMentors } = require("../controllers/mentorControllers");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to create a mentor request
router.post("/request", verifyToken, createMentorRequest);

// Route to fetch all mentor requests (for admin/mentors)
//router.get("/requests", verifyToken, getMentorRequests);
router.get("/mentors", fetchMentors);
router.post("/import", upload.single("file"), importMentors);

module.exports = router;