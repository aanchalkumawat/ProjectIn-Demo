const express = require("express");
const router = express.Router();

// ✅ Import all functions correctly
const { 
  getAllTeachers, 
  getUnallottedTeams, 
  getPanels,
  createPanel, 
  allotTeamToPanel, 
  getCoordinatorId // ✅ Ensure this is imported
} = require("../controllers/panelController"); // ✅ Correct path to controller

// ✅ Define routes
router.get("/teachers",getAllTeachers);
router.get("/unallotted-teams", getUnallottedTeams);
router.post("/create", createPanel);
router.get("/panels", getPanels);

router.post("/allot-team", allotTeamToPanel);
router.get("/coordinator", getCoordinatorId); // ✅ This should work now

module.exports = router;
