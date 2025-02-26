require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");
const Teacher = require("./models/Teacher");
const Coordinator = require("./models/Coordinator");
const bcrypt = require("bcryptjs");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected for Seeding"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Encrypt passwords before storing
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Sample data for Students
const students = [
  { name: "Aanchal Kumawat", email: "aanchal@banasthali.in", password: "password123", rollNo: "BTCTC22014" },
  { name: "Komal tyagi", email: "komal@banasthali.in", password: "password123", rollNo: "BTBTI22098" },
  { name: "Astha Shukla", email: "astha@banasthali.in", password: "password123", rollNo: "BTBTE3485" }
];

// Sample data for Teachers
const teachers = [
  { name: "Dr. Ravi Sharma", email: "ravi@banasthali.in", password: "password123", subject: "Computer Science" },
  { name: "Dr. Neha Verma", email: "neha@banasthali.in", password: "password123", subject: "AI/ML" }
];

// Sample data for Coordinators
const coordinators = [
  { name: "Prof. Meera Gupta", email: "meera@banasthali.in", password: "password123", department: "CS & IT" }
];

// Function to insert data into the database
const seedDatabase = async () => {
  try {
    // Hash passwords
    for (let student of students) student.password = await hashPassword(student.password);
    for (let teacher of teachers) teacher.password = await hashPassword(teacher.password);
    for (let coordinator of coordinators) coordinator.password = await hashPassword(coordinator.password);

    // Insert data
    await Student.insertMany(students);
    await Teacher.insertMany(teachers);
    await Coordinator.insertMany(coordinators);

    console.log("✅ Data Seeded Successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error Seeding Data:", error);
    mongoose.connection.close();
  }
};

// Run the function
seedDatabase();
