// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Project = require("./models/Project");
// const User = require("./models/User"); // Import User model

// dotenv.config();

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ Database connected successfully!"))
// .catch((err) => console.error("❌ Database connection error:", err));

// const seedDatabase = async () => {
//   try {
//     await Project.deleteMany(); // Clear existing projects
//     console.log("🗑️ Existing projects deleted.");

//     // Fetch a user from the database
//     let user = await User.findOne();
    
//     // If no users exist, create a dummy user
//     if (!user) {
//       user = new User({ name: "Dummy User", email: "dummy@example.com", password: "password123" });
//       await user.save();
//       console.log("👤 Dummy user created:", user._id);
//     }

//     // Sample projects data
//     const projectSeeds = [
//       { groupID: "CSD0001", projectName: "Smart Attendance System", mentorName: "Dr. Sharma", domain: "standalone-web", description: "A web app for automated attendance tracking.", researchBased: false, submittedBy: user._id },
//       { groupID: "CSD0002", projectName: "AI Chatbot", mentorName: "Dr. Verma", domain: "web-based", description: "A chatbot using AI to assist users.", researchBased: true, submittedBy: user._id },
//       { groupID: "CSD0003", projectName: "Blockchain Voting System", mentorName: "Prof. Mehta", domain: "web-based", description: "Secure online voting using blockchain.", researchBased: true, submittedBy: user._id },
//       { groupID: "CSD0004", projectName: "IoT Smart Home", mentorName: "Dr. Kapoor", domain: "android", description: "Home automation system using IoT.", researchBased: false, submittedBy: user._id },
//       { groupID: "CSD0005", projectName: "AI-Powered Resume Screener", mentorName: "Dr. Roy", domain: "standalone-web", description: "An AI tool for resume screening.", researchBased: true, submittedBy: user._id },
//       { groupID: "CSD0006", projectName: "Autonomous Delivery Drone", mentorName: "Prof. Iyer", domain: "arvr", description: "A drone delivery system using AI.", researchBased: true, submittedBy: user._id },
//       { groupID: "CSD0007", projectName: "E-commerce Recommendation System", mentorName: "Dr. Singh", domain: "web-based", description: "Personalized recommendations using AI.", researchBased: false, submittedBy: user._id },
//       { groupID: "CSD0008", projectName: "Cybersecurity Threat Detection", mentorName: "Dr. Choudhary", domain: "standalone-web", description: "Detecting cyber threats using ML.", researchBased: true, submittedBy: user._id },
//       { groupID: "CSD0009", projectName: "AI-Powered Medical Diagnosis", mentorName: "Dr. Patel", domain: "android", description: "An AI tool for medical disease detection.", researchBased: true, submittedBy: user._id },
//       { groupID: "CSD0010", projectName: "Smart Farming System", mentorName: "Prof. Reddy", domain: "arvr", description: "Using AI & IoT to improve farming.", researchBased: false, submittedBy: user._id },
//       { groupID: "CSD0011", projectName: "Automated Code Review System", mentorName: "Dr. Gupta", domain: "standalone-web", description: "An AI tool for code quality checks.", researchBased: true, submittedBy: user._id },
//       { groupID: "CSD0012", projectName: "AI-Driven Stock Market Predictor", mentorName: "Dr. Bose", domain: "web-based", description: "Stock prediction using deep learning.", researchBased: true, submittedBy: user._id },
//     ];

//     // Insert projects
//     await Project.insertMany(projectSeeds);
//     console.log("✅ 12 projects seeded successfully!");

//     mongoose.connection.close(); // Close DB connection
//   } catch (error) {
//     console.error("❌ Error seeding database:", error);
//   }
// };

// seedDatabase();

const mongoose = require("mongoose");
const MentorRequest =require("./models/MentorRequest.js"); // Adjust path if needed

// ✅ MongoDB connection URI (replace if needed)
const mongoURI = "mongodb+srv://ProjectIn:ProjectIn@completeprojectin.dzhbj.mongodb.net/users?retryWrites=true&w=majority&tls=true";

// 🚀 Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Existing mentors
const mentors = [
  {
    _id: new mongoose.Types.ObjectId("67e46962df81906b5ade8d71"),
    name: "Dr. Neha Agarwal",
  },
  {
    _id: new mongoose.Types.ObjectId("67e4696bdf81906b5ade8d89"),
    name: "Dr. Ramesh Yadav",
  },
];

// ✅ Mentor request data
const mentorRequests = [
  {
    projectName: "E-learning Platform",
    isResearchBased: false,
    projectDescription: "A web-based platform for online courses and training.",
    technologyDetails: "React, Node.js, MongoDB",
    members: [
      { name: "Kirtika Dwivedi", rollno: "2216845", _id: new mongoose.Types.ObjectId() },
      { name: "Divya Rawat", rollno: "BT124", _id: new mongoose.Types.ObjectId() },
    ],
    mentorName: mentors[0].name,
    mentorId: mentors[0]._id,
    leaderId: new mongoose.Types.ObjectId(),
    status: "Pending",
    createdAt: new Date(),
  },
  {
    projectName: "AI Chatbot for Education",
    isResearchBased: true,
    projectDescription: "An AI-based chatbot to assist students in learning.",
    technologyDetails: "Python, NLP, TensorFlow",
    members: [
      { name: "Riya Singh", rollno: "BT125", _id: new mongoose.Types.ObjectId() },
      { name: "Amit Kumar", rollno: "BT126", _id: new mongoose.Types.ObjectId() },
    ],
    mentorName: mentors[0].name,
    mentorId: mentors[0]._id,
    leaderId: new mongoose.Types.ObjectId(),
    status: "Pending",
    createdAt: new Date(),
  },
  {
    projectName: "Cloud-based File Storage",
    isResearchBased: false,
    projectDescription: "A scalable file storage system on the cloud.",
    technologyDetails: "AWS, Node.js, MongoDB",
    members: [
      { name: "Sakshi Verma", rollno: "BT127", _id: new mongoose.Types.ObjectId() },
      { name: "Rajesh Mehta", rollno: "BT128", _id: new mongoose.Types.ObjectId() },
    ],
    mentorName: mentors[1].name,
    mentorId: mentors[1]._id,
    leaderId: new mongoose.Types.ObjectId(),
    status: "Pending",
    createdAt: new Date(),
  },
  {
    projectName: "IoT-based Smart Home",
    isResearchBased: false,
    projectDescription: "A smart home system for automation and security.",
    technologyDetails: "IoT, Arduino, Node.js",
    members: [
      { name: "Kiran Joshi", rollno: "BT129", _id: new mongoose.Types.ObjectId() },
      { name: "Neha Tiwari", rollno: "BT130", _id: new mongoose.Types.ObjectId() },
    ],
    mentorName: mentors[1].name,
    mentorId: mentors[1]._id,
    leaderId: new mongoose.Types.ObjectId(),
    status: "Pending",
    createdAt: new Date(),
  },
  {
    projectName: "Sentiment Analysis Tool",
    isResearchBased: true,
    projectDescription: "A tool to analyze sentiments in social media posts.",
    technologyDetails: "Python, NLP, MongoDB",
    members: [
      { name: "Manish Sharma", rollno: "BT131", _id: new mongoose.Types.ObjectId() },
      { name: "Ankita Agarwal", rollno: "BT132", _id: new mongoose.Types.ObjectId() },
    ],
    mentorName: mentors[0].name,
    mentorId: mentors[0]._id,
    leaderId: new mongoose.Types.ObjectId(),
    status: "Pending",
    createdAt: new Date(),
  },
  {
    projectName: "Blockchain Voting System",
    isResearchBased: true,
    projectDescription: "A secure and transparent voting system using blockchain.",
    technologyDetails: "Blockchain, Solidity, Node.js",
    members: [
      { name: "Priya Sen", rollno: "BT133", _id: new mongoose.Types.ObjectId() },
      { name: "Aditya Roy", rollno: "BT134", _id: new mongoose.Types.ObjectId() },
    ],
    mentorName: mentors[1].name,
    mentorId: mentors[1]._id,
    leaderId: new mongoose.Types.ObjectId(),
    status: "Pending",
    createdAt: new Date(),
  },
];

// 🔍 Seed function
const seedData = async () => {
  try {
    // 🗑️ Clear previous data
    await MentorRequest.deleteMany({});
    console.log("🗑️ Previous mentor requests cleared.");

    // 🚀 Insert new mentor requests
    await MentorRequest.insertMany(mentorRequests);
    console.log("✅ Mentor requests seeded successfully!");

    // 🔌 Close DB connection
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    mongoose.connection.close();
  }
};

// 🏃 Run the function
seedData();
