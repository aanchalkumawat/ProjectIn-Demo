const Team = require("../models/Team");

const createTeam = async (req, res) => {
  try {
    const { teamName, leaderId, members, projectTitle } = req.body;

    // Create a new team
    const team = new Team({
      teamName,
      leaderId,
      members,
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

module.exports = { createTeam };
