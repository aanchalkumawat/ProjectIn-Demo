const mongoose = require("mongoose");
const Student = require("../models/Student");
const bcrypt = require("bcrypt");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "your_mongodb_atlas_connection_string";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedStudents = async () => {
  try {
    const jsonData = "";

    process.stdin.on("data", (chunk) => {
      jsonData += chunk;
    });

    process.stdin.on("end", async () => {
      const sheetData = JSON.parse(jsonData);

      if (!sheetData.length) {
        console.warn("⚠️ No data received for seeding.");
        mongoose.connection.close();
        return;
      }

      let insertedStudents = 0;
      let updatedStudents = 0;

      for (const row of sheetData) {
        if (!row.name || !row.email || !row.password || !row.enrollmentNumber || !row.subject) {
          console.warn("⚠️ Skipping incomplete row:", row);
          continue;
        }

        const name = row.name.trim();
        const email = row.email.trim();
        const password = row.password.trim();
        const enrollmentNumber = row.enrollmentNumber.toString().trim();
        const subject = row.subject.trim();

        const existingStudent = await Student.findOne({ $or: [{ email }, { enrollmentNumber }] });

        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingStudent) {
          await Student.updateOne(
            { email },
            { $set: { name, subject, password: hashedPassword, enrollmentNumber } }
          );
          console.log(`🔄 Updated existing student: ${email}`);
          updatedStudents++;
        } else {
          const newStudent = new Student({ name, email, password: hashedPassword, enrollmentNumber, subject });
          await newStudent.save();
          console.log(`✅ Inserted new student: ${email}`);
          insertedStudents++;
        }
      }

      console.log(`✅ Seeding Complete: ${insertedStudents} new students inserted, ${updatedStudents} students updated.`);
      mongoose.connection.close();
    });

  } catch (error) {
    console.error("❌ Error seeding students:", error);
    mongoose.connection.close();
  }
};

seedStudents();
