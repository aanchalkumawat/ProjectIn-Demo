const mongoose = require("mongoose");
const Coordinator = require("../models/Coordinator");
const bcrypt = require("bcrypt");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "your_mongodb_atlas_connection_string";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedCoordinators = async () => {
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

      let insertedCoordinators = 0;
      let updatedCoordinators = 0;

      for (const row of sheetData) {
        if (!row.name || !row.email || !row.password) {
          console.warn("⚠️ Skipping incomplete row:", row);
          continue;
        }

        const name = row.name.trim();
        const email = row.email.trim();
        const password = row.password.trim();

        const existingCoordinator = await Coordinator.findOne({ email });

        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingCoordinator) {
          await Coordinator.updateOne(
            { email },
            { $set: { name, password: hashedPassword } }
          );
          console.log(`🔄 Updated existing coordinator: ${email}`);
          updatedCoordinators++;
        } else {
          const newCoordinator = new Coordinator({ name, email, password: hashedPassword });
          await newCoordinator.save();
          console.log(`✅ Inserted new coordinator: ${email}`);
          insertedCoordinators++;
        }
      }

      console.log(`✅ Seeding Complete: ${insertedCoordinators} new coordinators inserted, ${updatedCoordinators} coordinators updated.`);
      mongoose.connection.close();
    });

  } catch (error) {
    console.error("❌ Error seeding coordinators:", error);
    mongoose.connection.close();
  }
};

seedCoordinators();
