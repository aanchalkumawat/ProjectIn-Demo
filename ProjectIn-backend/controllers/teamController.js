const Team = require("../models/Team");
const User = require("../models/User");
const Notification = require("../models/Notification");

// 📌 Create a Team
const createTeam = async (req, res) => {
  try {
    const { leaderName, leaderRollNo, course, leaderEmail } = req.body;

    // Ensure leader does not have an existing team
    const existingTeam = await Team.findOne({ leaderId: req.user.id });
    if (existingTeam) {
      return res.status(400).json({ message: "You already have a team." });
    }

    // Create new team
    const newTeam = new Team({
      leaderId: req.user.id,
      leaderEmail,
      leaderName,
      leaderRollNo,
      course,
      members: [req.user.id], // Leader is the first member
      pendingInvitations: [],
    });

    await newTeam.save();
    res.status(201).json({ message: "Team created successfully", team: newTeam });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Server error while creating team." });
  }
};

// 📌 Send Invitation
const sendInvite = async (req, res) => {
  try {
    const { teamId, email } = req.body;

    if (!teamId || !email) {
      return res.status(400).json({ message: "Team ID and email are required" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // ✅ Check if the team leader's required fields exist
    if (!team.leaderRollNo || !team.leaderName || !team.leaderEmail || !team.course) {
      return res.status(400).json({ message: "Leader details are missing in the team." });
    }

    if (team.members.length >= 5) {
      return res.status(400).json({ message: "Team is already full" });
    }
    if (team.pendingInvitations.length >= 5) {
      return res.status(400).json({ message: "Maximum invitations reached" });
    }

    // ✅ Check if the email is already invited
    const isAlreadyInvited = team.pendingInvitations.some(
      (invite) => invite.email === email && invite.status === "pending"
    );
    if (isAlreadyInvited) {
      return res.status(400).json({ message: "This user has already been invited" });
    }

    // ✅ Add the invitation with the correct status format
    team.pendingInvitations.push({ email, status: "pending" });

    await team.save();

    const user = await User.findOne({ email });
    if (user) {
      await Notification.create({
        userId: user._id,
        message: `You have been invited to join the team "${team.teamName}"`,
        teamId: team._id,
      });
    }

    res.status(201).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Error inviting member:", error);
    res.status(500).json({ message: "Server error while inviting member" });
  }
};
const fetchInvitations = async (req, res) => {
  try {
    console.log("Fetching invitations for user:", req.user.email);

    const teams = await Team.find({
      "pendingInvitations.email": req.user.email,
      "pendingInvitations.status": "Pending",
    });

    if (!teams.length) {
      return res.json({ invitations: [] }); // No invitations found
    }

    const invitations = teams.map((team) => ({
      teamId: team._id,
      teamName: team.teamName,
      projectTitle: team.projectTitle,
      notificationId: team.pendingInvitations.find(inv => inv.email === req.user.email)._id,
    }));

    res.status(200).json({ invitations });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ message: "Failed to fetch invitations" });
  }
};


// 📌 Respond to Invitation
const respondToInvitation = async (req, res) => {
  try {
    const { email, response } = req.body;

    // Find the team where this email is invited
    const team = await Team.findOne({ "pendingInvitations.email": email });
    if (!team) {
      return res.status(404).json({ message: "No invitation found." });
    }

    // Find the invitation and update its status
    const invitation = team.pendingInvitations.find((inv) => inv.email === email);
    if (!invitation || invitation.status !== "Pending") {
      return res.status(400).json({ message: "Invalid or expired invitation." });
    }

    if (response === "Accepted") {
      // Check if the team is full
      if (team.members.length >= 5) {
        return res.status(400).json({ message: "Team is already full." });
      }

      // Add the user to the team
      const user = await User.findOne({ email });
      if (user) {
        team.members.push(user._id);
      }
    }

    // Update the invitation status
    invitation.status = response;
    await team.save();

    res.status(200).json({ message: `Invitation ${response}` });
  } catch (error) {
    console.error("Error responding to invitation:", error);
    res.status(500).json({ message: "Server error while responding to invitation." });
  }
};

// 📌 Fetch Team Details
const getTeamDetails = async (req, res) => {
  try {
    const team = await Team.findOne({ leaderId: req.user.id }).populate("members", "name email");
    if (!team) {
      return res.status(404).json({ message: "No team found." });
    }
    res.status(200).json({ team });
  } catch (error) {
    console.error("Error fetching team details:", error);
    res.status(500).json({ message: "Server error while fetching team details." });
  }
};

const fetchNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

module.exports = {
  createTeam,
  sendInvite,
  respondToInvitation,
  getTeamDetails,
  fetchInvitations,
  fetchNotifications,
};
