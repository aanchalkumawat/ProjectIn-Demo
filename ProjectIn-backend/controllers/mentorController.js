const MentorRequest = require("../models/MentorRequest");
const Mentor = require("../models/Teacher");

// Create a new mentor request
const createMentorRequest = async (req, res) => {
  try {
    const {
      projectName,
      isResearchBased,
      projectDescription,
      technologyDetails,
      members,
      mentorName, // Mentor Name received from frontend
    } = req.body;

    // Validate required fields
    if (!projectName || !projectDescription || !technologyDetails || !members || !mentorName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find mentor by name to get the mentorId
    const mentor = await Mentor.findOne({ name: mentorName });

    if (!mentor) {
      return res.status(404).json({ message: "Selected mentor not found." });
    }

    // Create a new mentor request storing both mentorId and mentorName
    const mentorRequest = new MentorRequest({
      projectName,
      isResearchBased,
      projectDescription,
      technologyDetails,
      members,
      mentorName: mentor.name, // Store mentor name
      mentorId: mentor._id, // Store mentor ID fetched from database
      leaderId: req.user.id, // Leader ID from token
    });

    await mentorRequest.save();
    res.status(201).json({ message: "Mentor request submitted successfully.", mentorRequest });
  } catch (error) {
    console.error("Error creating mentor request:", error);
    res.status(500).json({ message: "Failed to create mentor request." });
  }
};


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



module.exports = { createMentorRequest,fetchMentors };