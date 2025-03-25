const express = require("express");
const { submitProject, getProjects } = require("../controllers/projectController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to submit a project
router.post("/", verifyToken, submitProject);

// Route to fetch all projects
router.get("/", verifyToken, getProjects);

module.exports = router;
