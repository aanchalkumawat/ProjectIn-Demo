const express = require('express');
const { registerUser,loginUser } = require('../controllers/authController');
const verifyToken = require("../middlewares/authMiddleware");
const Student = require("../models/Student");

const router = express.Router();

router.post("/register", registerUser);
router.post('/login', loginUser);
router.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error("❌ Error fetching student:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", verifyToken, (req, res) => {
  try {
    res.json({ user: req.user }); // `req.user` is set by the verifyToken middleware
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user details" });
  }
});


module.exports = router;