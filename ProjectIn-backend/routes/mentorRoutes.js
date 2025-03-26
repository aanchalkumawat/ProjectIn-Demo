const express = require("express");
const { createMentorRequest, /*getMentorRequests,*/fetchMentors } = require("../controllers/mentorController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to create a mentor request
router.post("/request", verifyToken, createMentorRequest);

// Route to fetch all mentor requests (for admin/mentors)
//router.get("/requests", verifyToken, getMentorRequests);
router.get("/mentors", fetchMentors);

module.exports = router;