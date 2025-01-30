const express = require("express");
const { fetchNotifications } = require("../controllers/notificationController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Define the route for fetching notifications
router.get("/notifications", verifyToken, fetchNotifications);

module.exports = router;
