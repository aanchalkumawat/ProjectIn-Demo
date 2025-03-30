const express = require("express");
const router = express.Router();
const { addNotification, getNotifications } = require("../controllers/notificationController");

// Route to fetch all notifications
router.get("/all", getNotifications);

module.exports = router;
