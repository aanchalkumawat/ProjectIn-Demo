const express = require("express");
const router = express.Router();
const { addRemark, getRemarks } = require("../controllers/remarksController");

// Add a new remark (Evaluation API)
router.post("/evaluate", addRemark);

// Fetch remarks for a specific team
router.get("/:teamId", getRemarks);

module.exports = router;
