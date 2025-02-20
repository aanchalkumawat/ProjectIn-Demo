require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Ensure this matches your User model path

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("📡 MongoDB connected..."))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Sample Users (Teachers & Coordinators)
const seedUsers = async () => {
  try {
    // Clear existing users (optional)
    await User.deleteMany({ role: { $in: ["teacher", "coordinator"] } });

    // Create new users
    const users = [
      {
        name: "Dr. pushpa devi",
        email: "pushpa@banasthali.in",
        password: await bcrypt.hash("password123", 10), // Hashed password
        role: "teacher",
      },
      {
        name: "Dr. Jane Smith",
        email: "janesmith@banasthali.in",
        password: await bcrypt.hash("password123", 10), // Hashed password
        role: "teacher",
      },
      {
        name: "Prof. Rajesh Sharma",
        email: "rajeshsharma@banasthali.in",
        password: await bcrypt.hash("admin@456", 10),
        role: "coordinator",
      },
    ];

    // Insert into the database
    await User.insertMany(users);
    console.log("✅ Teacher & Coordinator data seeded successfully!");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    mongoose.connection.close();
  }
};

// Run the seeding function
seedUsers();
