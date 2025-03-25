const Project = require("../models/Project");

// Submit a new project
const submitProject = async (req, res) => {
  try {
    const { groupID, projectName, mentorName, domain, description, researchBased } = req.body;

    // ✅ Debug: Check if data is coming from frontend
    console.log("🔹 Received Data:", req.body);

    // ✅ Check if all required fields are provided
    if (!groupID || !projectName || !mentorName || !domain || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Ensure `req.user.id` is available
    if (!req.user || !req.user.id) {
      console.log("🚨 User ID is missing in request.");
      return res.status(401).json({ message: "Unauthorized: User ID is missing." });
    }

    console.log("✅ User ID for project submission:", req.user.id);

    // ✅ Create Project object
    const newProject = new Project({
      groupID,
      projectName,
      mentorName,
      domain,
      description,
      researchBased: researchBased || false, // ✅ Default to false if undefined
      submittedBy: req.user.id,
    });

    await newProject.save();
    res.status(201).json({ message: "Project submitted successfully." });

  } catch (error) {
    console.error("❌ Error submitting project:", error);
    res.status(500).json({ message: "Server error while submitting project." });
  }
};

// Fetch all projects (for displaying in dashboard)
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("submittedBy", "name email");
    res.status(200).json({ projects });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ message: "Server error while fetching projects" });
  }
};

module.exports = { submitProject, getProjects };
