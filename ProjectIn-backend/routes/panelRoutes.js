const express = require("express");
const Panel = require("../models/Panel");

// ✅ Import all functions correctly
const { 
  getAllTeachers, 
  getUnallottedTeams, 
  getPanels,
  createPanel, 
  allotTeamToPanel, 
  getCoordinatorId 
} = require("../controllers/panelController"); // ✅ Ensure correct import path

const router = express.Router();

// ✅ Define routes
router.get("/teachers", getAllTeachers);
router.get("/unallotted-teams", getUnallottedTeams);
router.post("/create", createPanel);
router.get("/panels", getPanels);
router.post("/allot-team", allotTeamToPanel);
router.get("/coordinator", getCoordinatorId);

// ✅ Get all panels
router.get("/", async (req, res) => {
  try {
    const panels = await Panel.find();
    res.status(200).json(panels);
  } catch (error) {
    console.error("Error fetching panels:", error);
    res.status(500).json({ message: "Failed to fetch panels" });
  }
});

// ✅ Create a New Panel
router.post("/", async (req, res) => {
  const { panelName, teacher_ids, description } = req.body;

  if (!panelName || !teacher_ids || teacher_ids.length === 0) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const newPanel = new Panel({
      panelName,
      teacher_ids,
      description,
    });

    const savedPanel = await newPanel.save();
    res.status(201).json(savedPanel);
  } catch (error) {
    console.error("Error creating panel:", error);
    res.status(500).json({ message: "Failed to create panel" });
  }
});

// ✅ Get Panel by ID
router.get("/:id", async (req, res) => {
  try {
    const panel = await Panel.findById(req.params.id);
    if (!panel) {
      return res.status(404).json({ message: "Panel not found" });
    }
    res.json(panel);
  } catch (error) {
    console.error("Error fetching panel:", error);
    res.status(500).json({ message: "Failed to fetch panel" });
  }
});

// ✅ Update Panel
router.put("/:id", async (req, res) => {
  const { panelName, teacher_ids, description } = req.body;

  try {
    const updatedPanel = await Panel.findByIdAndUpdate(
      req.params.id,
      { panelName, teacher_ids, description },
      { new: true, runValidators: true }
    );
    if (!updatedPanel) {
      return res.status(404).json({ message: "Panel not found" });
    }
    res.json(updatedPanel);
  } catch (error) {
    console.error("Error updating panel:", error);
    res.status(500).json({ message: "Failed to update panel" });
  }
});

// ✅ Delete Panel
router.delete("/:id", async (req, res) => {
  try {
    const deletedPanel = await Panel.findByIdAndDelete(req.params.id);
    if (!deletedPanel) {
      return res.status(404).json({ message: "Panel not found" });
    }
    res.json({ message: "Panel deleted successfully" });
  } catch (error) {
    console.error("Error deleting panel:", error);
    res.status(500).json({ message: "Failed to delete panel" });
  }
});

module.exports = router; // ✅ Export using CommonJS
