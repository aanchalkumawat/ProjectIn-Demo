const mongoose = require("mongoose");
const Mentor = require("../models/Mentor");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const seedMentors = async () => {
  const mentors = [
    { name: "Dr. Aditi Sharma", email: "aditi.sharma@university.edu", expertise: "AI/ML", phone: "1234567890" },
    { name: "Prof. Ramesh Gupta", email: "ramesh.gupta@university.edu", expertise: "Cloud Computing", phone: "9876543210" },
  ];

  try {
    await Mentor.insertMany(mentors);
    console.log("Mentors seeded successfully");
    mongoose.disconnect();
  } catch (error) {
    console.error("Seeding Error:", error);
    mongoose.disconnect();
  }
};

seedMentors();
