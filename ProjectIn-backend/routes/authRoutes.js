const express = require('express');
const { registerUser,loginUser } = require('../controllers/authController');
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post('/login', loginUser);

router.get("/me", verifyToken, (req, res) => {
  try {
    res.json({ user: req.user }); // `req.user` is set by the verifyToken middleware
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user details" });
  }
});


module.exports = router;