const Notification = require("../models/Notification");

const fetchNotifications = async (req, res) => {
  try {
    // Fetch notifications for the logged-in user
    const notifications = await Notification.find({ userId: req.user.id });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
};

module.exports = { fetchNotifications };
