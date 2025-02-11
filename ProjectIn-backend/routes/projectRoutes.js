const express = require("express");
const { submitProject, getProjects } = require("../controllers/projectController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to submit a project
router.post("/submit", verifyToken, submitProject);

// Route to fetch all projects
router.get("/all", verifyToken, getProjects);

module.exports = router;
