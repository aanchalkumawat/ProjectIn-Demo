const Team = require("../models/Team");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { teamName, projectTitle } = req.body;

    if (!teamName || !projectTitle) {
      return res.status(400).json({ message: "Team name and project title are required" });
    }

    // Create a new team with the leader as the creator
    const team = new Team({
      teamName,
      leaderId: req.user.id, // The logged-in user becomes the leader
      members: [req.user.id], // Add the leader to the members list
      projectTitle,
    });

    // Save the team in the database
    await team.save();

    res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Error creating team" });
  }
};

// Get team details
const getTeamDetails = async (req, res) => {
  try {
    const team = await Team.findOne({ leaderId: req.user.id }).populate("members", "name email");

    if (!team) {
      return res.status(404).json({ message: "No team found for this user." });
    }

    res.status(200).json({ team });
  } catch (error) {
    console.error("Error fetching team details:", error);
    res.status(500).json({ message: "Server error while fetching team details" });
  }
};

// Invite a member by email
const inviteMember = async (req, res) => {
  try {
    const { teamId, email } = req.body;

    if (!teamId || !email) {
      return res.status(400).json({ message: "Team ID and email are required" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.members.length >= 5) {
      return res.status(400).json({ message: "Team is already full" });
    }
    if (team.pendingInvitations.length >= 5) {
      return res.status(400).json({ message: "Maximum invitations reached" });
    }

    const isAlreadyInvited = team.pendingInvitations.some(
      (invite) => invite.email === email && invite.status === "pending"
    );
    if (isAlreadyInvited) {
      return res.status(400).json({ message: "This user has already been invited" });
    }

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

// Respond to an invitation
const respondToInvitation = async (req, res) => {
  try {
    const { notificationId, response } = req.body;

    if (!["accepted", "rejected"].includes(response)) {
      return res.status(400).json({ message: "Invalid response" });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const team = await Team.findById(notification.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const invitation = team.pendingInvitations.find(
      (invite) => invite.email === req.user.email && invite.status === "pending"
    );
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    if (response === "accepted") {
      if (team.members.length >= 5) {
        return res.status(400).json({ message: "Team is already full" });
      }

      team.members.push(req.user.id);
      invitation.status = "accepted";
    } else if (response === "rejected") {
      invitation.status = "rejected";
    }

    await team.save();
    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ message: `Invitation ${response}` });
  } catch (error) {
    console.error("Error responding to invitation:", error);
    res.status(500).json({ message: "Server error while responding to invitation" });
  }
};
const fetchInvitations = async (req, res) => {
  try {
    // Find teams with pending invitations for the logged-in user
    console.log("Fetching invitations for user:", req.user.email);
    const teams = await Team.find({
      "pendingInvitations.email": req.user.email,
      "pendingInvitations.status": "pending",
    });

    if (!teams.length) {
      return res.json({ invitations: [] }); // No invitations
    }

    // Map team data to include only relevant details
    console.log("Teams with pending invitations:", teams);
    const invitations = teams.map((team) => ({
      teamId: team._id,
      teamName: team.teamName,
      projectTitle: team.projectTitle,
    }));

    res.json({ invitations });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ message: "Failed to fetch invitations" });
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
  getTeamDetails,
  inviteMember,
  respondToInvitation,
  fetchInvitations,
  fetchNotifications,
};

