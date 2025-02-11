const express = require("express");
const {
  createTeam,
  sendInvite,
  respondToInvitation,
  getTeamDetails,
  fetchInvitations,
  fetchNotifications,
} = require("../controllers/teamController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", verifyToken, createTeam);
router.post("/invite", verifyToken, sendInvite);
router.post("/respond", verifyToken, respondToInvitation);
router.get("/details", verifyToken, getTeamDetails);
router.get("/invitations", verifyToken, fetchInvitations);
router.get("/notifications", verifyToken, fetchNotifications);

module.exports = router;


