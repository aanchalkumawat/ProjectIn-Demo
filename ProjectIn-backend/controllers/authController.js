const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Controller for signing up a new user
const registerUser = async (req, res) => {
  try {
    console.log("Register Request Body:", req.body); // Log the incoming request body

    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!["student", "teacher", "coordinator"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Register Error: User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    console.log("New User Registered:", newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Controller for logging in an existing user
const loginUser = async (req, res) => {
  try {
    console.log("Login Request Body:", req.body); // Log the incoming request body

    const { email, password,role } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email,role });
    if (!user) {
      console.log("Login Error: User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login Error: Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Include email in the token payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("User Logged In:", { id: user._id, email: user.email });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { registerUser, loginUser };


