const Team = require("../models/Team");

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({});
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams", error });
  }
};

module.exports = { getTeams };
