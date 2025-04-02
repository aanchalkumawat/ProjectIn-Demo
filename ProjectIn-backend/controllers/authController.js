const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Coordinator = require("../models/Coordinator");
const Team = require("../models/Team"); // Import Team model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Controller for registering a new user
const registerUser = async (req, res) => {
  try {
    console.log("📌 Register Request Body:", req.body);

    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userModel = role === "student" ? Student : role === "teacher" ? Teacher : role === "coordinator" ? Coordinator : null;
    if (!userModel) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // 🔹 Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("❌ Register Error: User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔹 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Save new user
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    console.log("✅ New User Registered:", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// ✅ Controller for logging in a user with team persistence
const loginUser = async (req, res) => {
  try {
    console.log("📌 Login Request Body:", req.body);

    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    const userModel = role === "student" ? Student : role === "teacher" ? Teacher : role === "coordinator" ? Coordinator : null;
    if (!userModel) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("❌ Login Error: User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      console.log("❌ Login Error: Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let teamInfo = null;
    
    // 🔹 If the user is a student, check their team status
    if (role === "student") {
      const team = await Team.findOne({
        $or: [
          { "teamLeader.email": email }, // ✅ If the student is a team leader
          { "teamMembers.email": email } // ✅ If the student is a team member
        ]
      }).select("teamID domain teamLeader teamMembers");

      if (team) {
        teamInfo = {
          teamID: team.teamID,
          domain: team.domain,
          roleInTeam: team.teamLeader.email === email ? "Leader" : "Member", // ✅ Identify role
          status: team.teamMembers.find(member => member.email === email)?.status || "Accepted" // ✅ Fetch status
        };
      }
    }

    // 🔹 Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ User Logged In:", { id: user._id, email: user.email, team: teamInfo });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        team: teamInfo // ✅ Team info included
      },
    });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { registerUser, loginUser,};
