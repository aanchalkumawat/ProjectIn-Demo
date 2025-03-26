const express = require("express");
const { getTeamLimits, setTeamLimits } = require("../controllers/teamLimitController");

const router = express.Router();

router.get("/", getTeamLimits);
router.post("/", setTeamLimits);

module.exports = router;
