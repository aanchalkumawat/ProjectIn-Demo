const Coordinator = require("../models/Coordinator");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");

// ✅ Multer configuration for file upload (Memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Function to extract and save/update coordinators from Excel
const importCoordinators = async (req, res) => {
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

    let insertedCoordinators = 0;
    let updatedCoordinators = 0;

    // ✅ Process all coordinators in parallel
    const coordinatorPromises = sheetData.map(async (row) => {
      try {
        // ✅ Validate required fields
        if (!row.name || !row.email || !row.password) {
          console.warn("⚠️ Skipping incomplete row:", row);
          return;
        }

        // ✅ Trim values to remove unwanted spaces
        const name = row.name.trim();
        const email = row.email.trim();
        const password = row.password.trim();

        // ✅ Check if coordinator already exists
        const existingCoordinator = await Coordinator.findOne({ email });

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingCoordinator) {
          // ✅ Update existing coordinator
          await Coordinator.updateOne(
            { email },
            { $set: { name, password: hashedPassword } }
          );
          console.log(`🔄 Updated existing coordinator: ${email}`);
          updatedCoordinators++;
        } else {
          // ✅ Create new coordinator
          const newCoordinator = new Coordinator({
            name,
            email,
            password: hashedPassword,
          });

          // ✅ Save to MongoDB
          await newCoordinator.save();
          console.log(`✅ Inserted new coordinator: ${email}`);
          insertedCoordinators++;
        }
      } catch (err) {
        console.error(`❌ Error processing coordinator ${row.email}:`, err);
      }
    });

    // ✅ Wait for all coordinator records to be processed
    await Promise.all(coordinatorPromises);

    // ✅ Respond to frontend first
    res.status(201).json({
      message: `✅ Imported Successfully: ${insertedCoordinators} new coordinators. Updated: ${updatedCoordinators} coordinators.`,
    });

    // ✅ Run CoordinatorSeed.js automatically after import
    const seedScriptPath = path.join(__dirname, "../seeds/CoordinatorSeed.js");

    console.log("🚀 Running CoordinatorSeed.js...");
    const seedProcess = spawn("node", [seedScriptPath]);

    seedProcess.stdout.on("data", (data) => {
      console.log(`🔹 CoordinatorSeed Output: ${data.toString()}`);
    });

    seedProcess.stderr.on("data", (data) => {
      console.error(`❌ CoordinatorSeed Error: ${data.toString()}`);
    });

    seedProcess.on("close", (code) => {
      console.log(`✅ CoordinatorSeed.js process exited with code ${code}`);
    });

  } catch (error) {
    console.error("❌ Error importing coordinators:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Export upload middleware and function
module.exports = {
  upload,
  importCoordinators,
};
