const express = require("express");
const { getFreezeStatus, freezeTeams } = require("../controllers/freezeController");

const router = express.Router();

router.get("/freeze-status", getFreezeStatus);
router.post("/freeze", freezeTeams);

module.exports = router;
