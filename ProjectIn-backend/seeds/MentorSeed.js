const mongoose = require("mongoose");
const Mentor = require("../models/Mentor");
const Teacher = require("../models/Teacher");
const bcrypt = require("bcrypt");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "your_mongodb_atlas_connection_string";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedMentors = async () => {
  try {
    let jsonData = "";

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

      let insertedMentors = 0;
      let updatedMentors = 0;
      let insertedTeachers = 0;
      let updatedTeachers = 0;

      for (const row of sheetData) {
        if (!row.name || !row.email || !row.password || !row.expertise) {
          console.warn("⚠️ Skipping incomplete row:", row);
          continue;
        }

        const name = row.name.trim();
        const email = row.email.trim();
        const password = row.password.trim();
        const expertise = row.expertise.trim();

        const existingMentor = await Mentor.findOne({ email });
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingMentor) {
          await Mentor.updateOne(
            { email },
            { $set: { name, expertise, password: hashedPassword } }
          );
          console.log(`🔄 Updated existing mentor: ${email}`);
          updatedMentors++;
        } else {
          const newMentor = new Mentor({ name, email, password: hashedPassword, expertise });
          await newMentor.save();
          console.log(`✅ Inserted new mentor: ${email}`);
          insertedMentors++;
        }

        const existingTeacher = await Teacher.findOne({ email });

        if (existingTeacher) {
          await Teacher.updateOne({ email }, { $set: { name, password: hashedPassword } });
          console.log(`🔄 Updated existing teacher: ${email}`);
          updatedTeachers++;
        } else {
          const newTeacher = new Teacher({ name, email, password: hashedPassword });
          await newTeacher.save();
          console.log(`✅ Inserted new teacher: ${email}`);
          insertedTeachers++;
        }
      }

      console.log(`✅ Seeding Complete: ${insertedMentors} new mentors inserted, ${updatedMentors} mentors updated. Also, ${insertedTeachers} new teachers added, ${updatedTeachers} teachers updated.`);
      mongoose.connection.close();
    });
  } catch (error) {
    console.error("❌ Error seeding mentors:", error);
    mongoose.connection.close();
  }
};

seedMentors();