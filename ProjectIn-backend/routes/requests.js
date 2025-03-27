const express = require("express");
const mongoose = require("mongoose");
const MentorRequest = require("../models/MentorRequest");
const AcceptedRequest = require("../models/AcceptedRequests");

const router = express.Router();

// ✅ Fetch all mentor requests
router.get("/mentor-requests", async (req, res) => {
  try {
    const requests = await MentorRequest.find();
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Error fetching requests", error });
  }
});

// ✅ Accept a request and move it to acceptedrequests
router.post("/accepted-requests", async (req, res) => {
  try {
    const { _id, projectName, projectDescription, members } = req.body;

    // ✅ Ensure all required fields are provided
    if (!_id || !projectName || !projectDescription) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Check if the request exists before processing
    const existingRequest = await MentorRequest.findById(_id);
    if (!existingRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    // ✅ Ensure the request isn't already accepted (prevent duplicates)
    const alreadyAccepted = await AcceptedRequest.findOne({ requestId: _id });
    if (alreadyAccepted) {
      return res.status(409).json({ error: "Request already accepted" });
    }

    // ✅ Transform data to match AcceptedRequest model
    const acceptedRequest = new AcceptedRequest({
      requestId: _id, // ✅ Store reference to original request
      teamName: projectDescription, // ✅ Mapping projectDescription → teamName
      projectName,
      description: projectDescription,
      teamMembers: Array.isArray(members) ? members.map(member => member.name) : [], // ✅ Ensure safe mapping
      acceptedAt: new Date(), // ✅ Store acceptance date
    });

    await acceptedRequest.save(); // ✅ Save to acceptedrequests collection
    await MentorRequest.findByIdAndDelete(_id); // ✅ Remove from mentorrequests collection

    res.json({ message: "Request accepted successfully", acceptedRequest });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Error accepting request", error });
  }
});

module.exports = router; // ✅ Export using CommonJS
