const express = require("express");
const { getTeamLimits, setTeamLimits } = require("../controllers/teamLimitController");
const TeamLimit = require("../models/TeamLimit");
const router = express.Router();

router.get("/", getTeamLimits);
// Get team limit for a mentor
// Get global team limit (no need to pass mentorId)
router.get("/", async (req, res) => {
    try {
      const teamLimit = await TeamLimit.findOne();
      console.log("📌 Found team limit:", teamLimit);
  
      if (!teamLimit) {
        return res.status(404).json({ message: "Team limit not found" });
      }
  
      res.status(200).json({ maxTeams: teamLimit.maxTeams });
    } catch (error) {
      console.error("Error fetching team limit:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
router.post("/", setTeamLimits);

module.exports = router;
