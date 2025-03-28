const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const Student = require("../models/Student");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { getTeamStats,getGroupIDs } = require("../controllers/teamController");
const { getTeams } = require("../controllers/teamControllers");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate unique Team_ID
async function generateTeamID() {
  const lastTeam = await Team.findOne({ teamID: /^CSD\d{4}$/ })
    .sort({ teamID: -1 }) // Sorting in descending order
    .lean(); // Use `.lean()` to optimize query performance

  if (!lastTeam || !lastTeam.teamID) return "CSD0001";

  let lastID = parseInt(lastTeam.teamID.replace("CSD", ""), 10);
  
  console.log("LAST Team ID:", lastID);
  return `CSD${String(lastID + 1).padStart(4, "0")}`;
}

// ✅ API: Create a Team
router.post("/create", async (req, res) => {
  try {
    console.log("\n📥 Request received:\n", JSON.stringify(req.body, null, 2));

    const { teamLeader, teamSize, teamMembers } = req.body;

    if (!teamLeader || !teamSize || !teamMembers) {
      console.log("❌ Missing required fields!");
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("✅ Checking for existing teams with the same leader...");
    const existingLeaderTeam = await Team.findOne({
      "teamLeader.enrollmentNumber": teamLeader.enrollmentNumber,
    });

    if (existingLeaderTeam) {
      console.log("❌ Leader has already formed a team!");
      return res.status(400).json({ message: "Leader already has a team!" });
    }

    console.log("✅ Checking if any team members are already in another team...");
    const existingTeams = await Team.find({
      "teamMembers.enrollmentNumber": { $in: teamMembers.map(m => m.enrollmentNumber) }
    });

    if (existingTeams.length > 0) {
      console.log("❌ One or more members are already in a different team!");
      return res.status(400).json({ message: "One or more members are already in another team!" });
    }

    console.log("✅ Fetching team members' emails from database...");
    const memberEnrollments = teamMembers.map(m => m.enrollmentNumber);
    const existingStudents = await Student.find({ enrollmentNumber: { $in: memberEnrollments } });

    if (existingStudents.length !== teamMembers.length) {
      console.log("❌ Some team members do not exist in the database.");
      return res.status(400).json({ message: "One or more members do not exist in the database." });
    }

    const teamID = await generateTeamID();
    console.log("Generated Team ID:", teamID);

    const enrichedTeamMembers = teamMembers.map(member => {
      const studentRecord = existingStudents.find(s => s.enrollmentNumber === member.enrollmentNumber);
      return {
        ...member,
        email: studentRecord ? studentRecord.email : null,
        status: "Pending",
      };
    });

    if (enrichedTeamMembers.some(m => !m.email)) {
      console.log("❌ Missing email for some members!");
      return res.status(400).json({ message: "Email not found for all members." });
    }

    const newTeam = new Team({ teamID, teamLeader, teamSize, teamMembers: enrichedTeamMembers, isNotified: false });
    console.log("🛠️ Final Team Object before saving:", newTeam);
    await newTeam.save();

    for (const member of enrichedTeamMembers) {
      const acceptLink = `http://localhost:5000/api/team/accept?teamID=${teamID}&memberID=${member.enrollmentNumber}`;
      const rejectLink = `http://localhost:5000/api/team/reject?teamID=${teamID}&memberID=${member.enrollmentNumber}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: member.email,
        subject: "Team Formation Notification",
        html: `
          <p>Hello ${member.fullName},</p>
          <p>You have been invited to join a team.</p>
          <p><strong>Team ID:</strong> ${teamID}</p>
          <p><strong>Team Leader:</strong> ${teamLeader.fullName}</p>
          <p>Click below to Accept or Reject the invitation:</p>
          <a href="${acceptLink}" style="padding:10px; background-color:green; color:white; text-decoration:none; border-radius:5px;">Accept</a>
          <a href="${rejectLink}" style="padding:10px; background-color:red; color:white; text-decoration:none; border-radius:5px; margin-left:10px;">Reject</a>
          <p>Best regards,<br>ProjectIn Team</p>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`❌ Failed to send email to ${member.email}:`, error.message);
        } else {
          console.log(`📩 Email sent to ${member.email}:`, info.response);
        }
      });
    }

    console.log("✅ Team saved successfully and Notifications Sent!");
    res.status(201).json({ message: "Team created successfully!", teamID });

  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ message: "Error creating team", error: error.message });
  }
});

// ✅ API: Accept Invitation
router.get("/accept", async (req, res) => {
  try {
    const { teamID, memberID } = req.query;

    if (!teamID || !memberID) {
      return res.status(400).json({ message: "Missing teamID or memberID" });
    }

    const team = await Team.findOne({ teamID, "teamMembers.enrollmentNumber": memberID });
    if (!team) {
      return res.status(404).json({ message: "Team or member not found" });
    }

    await Team.updateOne(
      { teamID, "teamMembers.enrollmentNumber": memberID },
      { $set: { "teamMembers.$.status": "Accepted" } }
    );

    res.send(`<h2>✅ You have successfully accepted the team invitation.</h2>`);
  } catch (error) {
    console.error("❌ Error accepting team invitation:", error.message);
    res.send(`<h2>❌ Error processing your request. Please try again.</h2>`);
  }
});

// ✅ API: Reject Invitation
router.get("/reject", async (req, res) => {
  try {
    const { teamID, memberID } = req.query;

    if (!teamID || !memberID) {
      return res.status(400).json({ message: "Missing teamID or memberID" });
    }

    const team = await Team.findOne({ teamID, "teamMembers.enrollmentNumber": memberID });
    if (!team) {
      return res.status(404).json({ message: "Team or member not found" });
    }

    await Team.updateOne(
      { teamID, "teamMembers.enrollmentNumber": memberID },
      { $set: { "teamMembers.$.status": "Rejected" } }
    );

    res.send(`<h2>❌ You have rejected the team invitation.</h2>`);
  } catch (error) {
    console.error("❌ Error rejecting team invitation:", error.message);
    res.send(`<h2>❌ Error processing your request. Please try again.</h2>`);
  }
});

// ✅ API: Delete a Team
router.delete("/:id", async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) return res.status(404).json({ message: "Team not found!" });
    res.json({ message: "Team deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting team", error });
  }
});
router.get("/stats", getTeamStats);
router.get("/getTeams", getTeams);
router.post("/get-group-ids", getGroupIDs);

module.exports = router;
