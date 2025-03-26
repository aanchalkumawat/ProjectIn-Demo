import Mentor from "../models/Mentor.js";
import Teacher from "../models/Teacher.js";
import bcrypt from "bcrypt";
import XLSX from "xlsx";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ✅ Get __dirname equivalent for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Multer configuration for file upload (Memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Function to extract and save/update mentors from Excel
export const importMentors = async (req, res) => {
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

    let insertedMentors = 0;
    let updatedMentors = 0;

    // ✅ Process all mentors sequentially
    for (const row of sheetData) {
      try {
        // ✅ Validate required fields
        if (!row.name || !row.email || !row.password || !row.expertise) {
          console.warn("⚠️ Skipping incomplete row:", row);
          continue;
        }

        // ✅ Trim values to remove unwanted spaces
        const name = row.name.trim();
        const email = row.email.trim();
        const password = row.password.trim();
        const expertise = row.expertise.trim();

        // ✅ Check if mentor already exists
        const existingMentor = await Mentor.findOne({ email });
        const existingTeacher = await Teacher.findOne({ email });

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingMentor) {
          // ✅ Update existing mentor
          await Mentor.updateOne(
            { email },
            { $set: { name, expertise, password: hashedPassword } }
          );
          console.log(`🔄 Updated existing mentor: ${email}`);
          updatedMentors++;
        } else {
          // ✅ Create new mentor
          const newMentor = new Mentor({
            name,
            email,
            password: hashedPassword,
            expertise,
          });
          await newMentor.save();
          console.log(`✅ Inserted new mentor: ${email}`);
          insertedMentors++;
        }

        if (!existingTeacher) {
          // ✅ Add mentor to Teacher database if not already present
          const newTeacher = new Teacher({ name, email, password: hashedPassword });
          await newTeacher.save();
          console.log(`✅ Inserted mentor into Teacher database: ${email}`);
        }
      } catch (err) {
        console.error(`❌ Error processing mentor ${row.email}:`, err);
      }
    }

    // ✅ Respond to frontend
    res.status(201).json({
      message: `✅ Imported Successfully: ${insertedMentors} new mentors. Updated: ${updatedMentors} mentors.`,
    });

    // ✅ Run MentorSeed.js automatically after import
    const seedScriptPath = path.join(__dirname, "../seeds/MentorSeed.js");

    console.log("🚀 Running MentorSeed.js...");
    const seedProcess = spawn("node", [seedScriptPath]);

    seedProcess.stdout.on("data", (data) => {
      console.log(`🔹 MentorSeed Output: ${data.toString()}`);
    });

    seedProcess.stderr.on("data", (data) => {
      console.error(`❌ MentorSeed Error: ${data.toString()}`);
    });

    seedProcess.on("close", (code) => {
      console.log(`✅ MentorSeed.js process exited with code ${code}`);
    });
  } catch (error) {
    console.error("❌ Error importing mentors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Export upload middleware
export { upload };
