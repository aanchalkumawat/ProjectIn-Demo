const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Route to delete all documents in all collections
router.delete("/flush-all", async (req, res) => {
  try {
    // Get all collection names from MongoDB
    const collections = Object.keys(mongoose.connection.collections);

    // Loop through each collection and delete all documents
    for (let collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany({}); // Deletes all documents while keeping the structure
    }

    res.json({ message: "All collections truncated successfully!" });
  } catch (error) {
    console.error("Error truncating collections:", error);
    res.status(500).json({ message: "Failed to truncate collections.", error });
  }
});

module.exports = router;