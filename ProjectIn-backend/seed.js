const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Project = require("./models/Project");
const User = require("./models/User"); // Import User model

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Database connected successfully!"))
.catch((err) => console.error("❌ Database connection error:", err));

const seedDatabase = async () => {
  try {
    await Project.deleteMany(); // Clear existing projects
    console.log("🗑️ Existing projects deleted.");

    // Fetch a user from the database
    let user = await User.findOne();
    
    // If no users exist, create a dummy user
    if (!user) {
      user = new User({ name: "Dummy User", email: "dummy@example.com", password: "password123" });
      await user.save();
      console.log("👤 Dummy user created:", user._id);
    }

    // Sample projects data
    const projectSeeds = [
      { groupID: "CSD0001", projectName: "Smart Attendance System", mentorName: "Dr. Sharma", domain: "standalone-web", description: "A web app for automated attendance tracking.", researchBased: false, submittedBy: user._id },
      { groupID: "CSD0002", projectName: "AI Chatbot", mentorName: "Dr. Verma", domain: "web-based", description: "A chatbot using AI to assist users.", researchBased: true, submittedBy: user._id },
      { groupID: "CSD0003", projectName: "Blockchain Voting System", mentorName: "Prof. Mehta", domain: "web-based", description: "Secure online voting using blockchain.", researchBased: true, submittedBy: user._id },
      { groupID: "CSD0004", projectName: "IoT Smart Home", mentorName: "Dr. Kapoor", domain: "android", description: "Home automation system using IoT.", researchBased: false, submittedBy: user._id },
      { groupID: "CSD0005", projectName: "AI-Powered Resume Screener", mentorName: "Dr. Roy", domain: "standalone-web", description: "An AI tool for resume screening.", researchBased: true, submittedBy: user._id },
      { groupID: "CSD0006", projectName: "Autonomous Delivery Drone", mentorName: "Prof. Iyer", domain: "arvr", description: "A drone delivery system using AI.", researchBased: true, submittedBy: user._id },
      { groupID: "CSD0007", projectName: "E-commerce Recommendation System", mentorName: "Dr. Singh", domain: "web-based", description: "Personalized recommendations using AI.", researchBased: false, submittedBy: user._id },
      { groupID: "CSD0008", projectName: "Cybersecurity Threat Detection", mentorName: "Dr. Choudhary", domain: "standalone-web", description: "Detecting cyber threats using ML.", researchBased: true, submittedBy: user._id },
      { groupID: "CSD0009", projectName: "AI-Powered Medical Diagnosis", mentorName: "Dr. Patel", domain: "android", description: "An AI tool for medical disease detection.", researchBased: true, submittedBy: user._id },
      { groupID: "CSD0010", projectName: "Smart Farming System", mentorName: "Prof. Reddy", domain: "arvr", description: "Using AI & IoT to improve farming.", researchBased: false, submittedBy: user._id },
      { groupID: "CSD0011", projectName: "Automated Code Review System", mentorName: "Dr. Gupta", domain: "standalone-web", description: "An AI tool for code quality checks.", researchBased: true, submittedBy: user._id },
      { groupID: "CSD0012", projectName: "AI-Driven Stock Market Predictor", mentorName: "Dr. Bose", domain: "web-based", description: "Stock prediction using deep learning.", researchBased: true, submittedBy: user._id },
    ];

    // Insert projects
    await Project.insertMany(projectSeeds);
    console.log("✅ 12 projects seeded successfully!");

    mongoose.connection.close(); // Close DB connection
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};

seedDatabase();
