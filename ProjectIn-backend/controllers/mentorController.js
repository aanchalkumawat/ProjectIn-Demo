const MentorRequest = require("../models/MentorRequest");

// Create a new mentor request
const createMentorRequest = async (req, res) => {
  try {
    const {
      projectName,
      isResearchBased,
      projectDescription,
      technologyDetails,
      members,
      mentorName,
    } = req.body;

    // Validate required fields
    if (!projectName || !projectDescription || !technologyDetails || !members || !mentorName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new mentor request
    const mentorRequest = new MentorRequest({
      projectName,
      isResearchBased,
      projectDescription,
      technologyDetails,
      members,
      mentorName,
      leaderId: req.user.id, // From the token
    });

    await mentorRequest.save();
    res.status(201).json({ message: "Mentor request submitted successfully.", mentorRequest });
  } catch (error) {
    console.error("Error creating mentor request:", error);
    res.status(500).json({ message: "Failed to create mentor request." });
  }
};

// Get all mentor requests (for admin/mentor view)
const getMentorRequests = async (req, res) => {
  try {
    const mentorRequests = await MentorRequest.find().populate("leaderId", "name email");
    res.status(200).json({ mentorRequests });
  } catch (error) {
    console.error("Error fetching mentor requests:", error);
    res.status(500).json({ message: "Failed to fetch mentor requests." });
  }
};
const Mentor = require("../models/Mentor");

// Fetch all mentors
const fetchMentors = async (req, res) => {
  console.log("Fetching mentors...");

  try {
    const mentors = await Mentor.find().select("name email expertise");
    
    if (!mentors || mentors.length === 0) {
      console.log("No mentors found in database.");
      return res.status(404).json({ message: "No mentors available" });
    }

    console.log("Mentors found:", mentors);
    res.status(200).json({ mentors });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({ message: "Failed to fetch mentors." });
  }
};



module.exports = { createMentorRequest, getMentorRequests,fetchMentors };