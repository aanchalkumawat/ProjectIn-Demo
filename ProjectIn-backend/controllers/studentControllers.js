const Student = require("../models/Student");
const Team = require("../models/Team");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");

// ✅ Multer configuration for file upload (Memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Function to extract and save/update students from Excel
const importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Read Excel file from buffer (in-memory)
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log("🔹 Extracted Data from Excel:", sheetData);

    if (!sheetData.length) {
      return res.status(400).json({ error: "Excel file is empty" });
    }

    let insertedStudents = 0;
    let updatedStudents = 0;

    // ✅ Process all students in parallel
    const studentPromises = sheetData.map(async (row) => {
      try {
        // ✅ Validate required fields
        if (!row.name || !row.email || !row.password || !row.enrollmentNumber || !row.subject) {
          console.warn("⚠️ Skipping incomplete row:", row);
          return;
        }

        // ✅ Trim values to remove unwanted spaces
        const name = row.name.trim();
        const email = row.email.trim();
        const password = row.password.trim();
        const enrollmentNumber = row.enrollmentNumber.toString().trim();
        const subject = row.subject.trim();

        // ✅ Check if student already exists
        const existingStudent = await Student.findOne({ $or: [{ email }, { enrollmentNumber }] });

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingStudent) {
          // ✅ Update existing student
          await Student.updateOne(
            { email },
            { $set: { name, subject, password: hashedPassword, enrollmentNumber } }
          );
          console.log(`🔄 Updated existing student: ${email}`);
          updatedStudents++;
        } else {
          // ✅ Create new student
          const newStudent = new Student({
            name,
            email,
            password: hashedPassword,
            enrollmentNumber,
            subject,
          });

          // ✅ Save to MongoDB
          await newStudent.save();
          console.log(`✅ Inserted new student: ${email}`);
          insertedStudents++;
        }
      } catch (err) {
        console.error(`❌ Error processing student ${row.email}:`, err);
      }
    });

    // ✅ Wait for all student records to be processed
    await Promise.all(studentPromises);

    // ✅ Respond to frontend first
    res.status(201).json({
      message: `✅ Imported Successfully: ${insertedStudents} new students. Updated: ${updatedStudents} students.`,
    });

    // ✅ Run StudentSeed.js automatically after import
    const seedScriptPath = path.join(__dirname, "../seeds/StudentSeed.js");

    console.log("🚀 Running StudentSeed.js...");
    const seedProcess = spawn("node", [seedScriptPath]);

    seedProcess.stdout.on("data", (data) => {
      console.log(`🔹 StudentSeed Output: ${data.toString()}`);
    });

    seedProcess.stderr.on("data", (data) => {
      console.error(`❌ StudentSeed Error: ${data.toString()}`);
    });

    seedProcess.on("close", (code) => {
      console.log(`✅ StudentSeed.js process exited with code ${code}`);
    });

  } catch (error) {
    console.error("❌ Error importing students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    // Fetch student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found in DB" });
    }

    // Fetch the team using teamID (if exists)
    let teamData = null;
    if (student.team?.teamID) {
      teamData = await Team.findOne({ teamID: student.team.teamID });
    }

    res.status(200).json({ student, team: teamData });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Export upload middleware and function
module.exports = {
  upload,
  importStudents,
  getStudentById,
};
