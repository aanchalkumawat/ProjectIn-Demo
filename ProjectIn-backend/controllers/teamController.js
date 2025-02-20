const Team = require('../models/Team');

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { name, rollno, email, course } = req.body;
    
    const newTeam = new Team({
      leader: { name, rollno, email, course },
      invitations: []
    });

    await newTeam.save();
    res.status(201).json({ message: "Team created successfully", team: newTeam });
  } catch (error) {
    res.status(500).json({ message: "Error creating team", error });
  }
};

// Send an invitation
const sendInvite = async (req, res) => {
  try {
    const { teamId, email } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.invitations.some(inv => inv.email === email)) {
      return res.status(400).json({ message: "This email has already been invited." });
    }

    team.invitations.push({ email, status: 'Pending' });
    await team.save();

    res.status(200).json({ message: "Invitation sent", invitations: team.invitations });
  } catch (error) {
    res.status(500).json({ message: "Error sending invite", error });
  }
};

// Accept or Reject Invitation
const updateInvitation = async (req, res) => {
  try {
    const { teamId, email, status } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const invitation = team.invitations.find(inv => inv.email === email);
    if (!invitation) return res.status(404).json({ message: "Invitation not found" });

    invitation.status = status;
    await team.save();

    res.status(200).json({ message: `Invitation ${status.toLowerCase()}`, invitations: team.invitations });
  } catch (error) {
    res.status(500).json({ message: "Error updating invitation status", error });
  }
};

// Remove Rejected Invitations
const removeRejected = async (req, res) => {
  try {
    const { teamId, email } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.invitations = team.invitations.filter(inv => inv.email !== email);
    await team.save();

    res.status(200).json({ message: "Rejected invitation removed", invitations: team.invitations });
  } catch (error) {
    res.status(500).json({ message: "Error removing rejected invitation", error });
  }
};

// Get Team Details
const getTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team", error });
  }
};
module.exports = { createTeam, sendInvite,getTeam,removeRejected,updateInvitation};