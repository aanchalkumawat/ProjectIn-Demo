const mongoose = require("mongoose");

const flushAllData = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    // Fetch all collection names in the database
    const collections = await db.listCollections().toArray();

    // Iterate through collections and delete documents (except 'coordinators')
    for (let collection of collections) {
      const collectionName = collection.name;

      if (collectionName !== "coordinators") {
        await db.collection(collectionName).deleteMany({});
        console.log(`Cleared collection: ${collectionName}`);
      }
    }

    res.json({ message: "All collections (except coordinators) have been flushed successfully!" });
  } catch (error) {
    console.error("Error flushing data:", error);
    res.status(500).json({ message: "Failed to flush data." });
  }
};

module.exports = { flushAllData };