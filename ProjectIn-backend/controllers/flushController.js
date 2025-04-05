const mongoose = require("mongoose");

/**
 * Truncate all collections in the database while preserving their structure.
 */
const flushAllCollections = async (req, res) => {
  try {
    // Get all collection names from MongoDB
    const collections = Object.keys(mongoose.connection.collections);

    // Loop through collections and delete all documents
    for (let collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany({}); // Deletes all documents
    }

    res.status(200).json({ message: "All collections have been flushed successfully!" });
  } catch (error) {
    console.error("Error in flushing collections:", error);
    res.status(500).json({ message: "Error while flushing collections", error });
  }
};

module.exports = { flushAllCollections };