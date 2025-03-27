const express = require("express");
const MentorRequest = require("../models/MentorRequest"); // ✅ Corrected Model
const AcceptedRequest = require("../models/AcceptedRequest");

const router = express.Router();

// ✅ Get all mentor requests by Mentor ID
router.get("/:mentorId", async (req, res) => {
  const { mentorId } = req.params;
  try {
    const requests = await MentorRequest.find({ mentorId });

    res.json(requests.map(req => ({
      projectName: req.projectName,
      teamMembers: req.members, // ✅ Fixed field name
      description: req.projectDescription, // ✅ Fixed field name
    })));
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Error fetching requests", error });
  }
});

// ✅ Accept a request and move it to AcceptedRequests collection
router.post("/accepted-requests", async (req, res) => {
  const { id } = req.body; // Extract the ID from request body
  try {
    const requestId = id.trim(); // Ensure ID is correctly formatted

    // Check if the request exists
    const request = await MentorRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Move to AcceptedRequests collection
    const acceptedRequest = new AcceptedRequest({
      teamName: request.projectDescription, // Ensure correct field mapping
      projectName: request.projectName,
      teamMembers: request.members,
      description: request.projectDescription,
      acceptedAt: new Date(),
    });

    await acceptedRequest.save(); // Save in AcceptedRequests
    // await MentorRequest.findByIdAndDelete(id); // Uncomment if you want to remove from requests after accepting

    res.status(200).json({ message: "Request accepted successfully", acceptedRequest });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Error accepting request", error });
  }
});

// ✅ Reject a mentor request (Delete Request by projectName)
router.delete("/:projectName", async (req, res) => {
  const { projectName } = req.params;
  console.log("🟢 Deleting Request for Project:", projectName);

  try {
    const deletedRequest = await MentorRequest.findOneAndDelete({ projectName });
    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router; // ✅ Export using CommonJS
