const express = require("express");
const {
  createTeam,
  getTeamDetails,
  inviteMember,
  respondToInvitation,
  fetchInvitations,
  fetchNotifications,
} = require("../controllers/teamController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Team routes
router.post("/create", verifyToken, createTeam);
router.get("/details", verifyToken, getTeamDetails);
router.post("/invite", verifyToken, inviteMember);
router.post("/respond", verifyToken, respondToInvitation);
router.get("/invitations", verifyToken, fetchInvitations);
router.get("/notifications", verifyToken, fetchNotifications);
module.exports = router;


