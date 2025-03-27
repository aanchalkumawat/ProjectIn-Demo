const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher.js"); // ✅ Use Teacher model

const router = express.Router();

// ✅ Register Teacher (if required)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newTeacher = new Teacher({ name, email, password: hashedPassword });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering teacher" });
  }
});

// ✅ Login Teacher
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if teacher exists
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: teacher._id, email: teacher.email, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Generated Token:", token);  // ✅ Debugging

    // Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: "teacher",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error during login" });
  }
});

module.exports = router;
