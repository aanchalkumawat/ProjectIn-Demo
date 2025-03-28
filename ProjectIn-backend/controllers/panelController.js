const mongoose = require("mongoose");
const Teacher = require("../models/Teacher");
const Team = require("../models/Team");
const Panel = require("../models/Panel");
const Coordinator = require("../models/Coordinator");

// ✅ Fetch All Teachers (Unassigned Only)
const getAllTeachers = async (req, res) => {
  try {
    const allTeachers = await Teacher.find({}, "_id name");
    const assignedPanels = await Panel.find({}, "teacher_ids");

    const assignedTeacherIds = new Set(
      assignedPanels.flatMap(panel => panel.teacher_ids.map(id => id.toString()))
    );

    const unassignedTeachers = allTeachers.filter(
      teacher => !assignedTeacherIds.has(teacher._id.toString())
    );

    res.json(unassignedTeachers);
  } catch (error) {
    console.error("Error fetching unassigned teachers:", error);
    res.status(500).json({ error: "Failed to fetch unassigned teachers" });
  }
};

// ✅ Fetch Unallotted Teams (Teams not assigned to any panel)
const getUnallottedTeams = async (req, res) => {
  try {
    console.log("🔍 Fetching unallotted teams...");

    // ✅ Fetch all team IDs assigned to panels
    const allottedTeams = await Panel.find({}, "team_ids");

    const allottedTeamIds = new Set(
      allottedTeams.flatMap(panel => (panel.team_ids ? panel.team_ids.map(id => id.toString()) : []))
    );

    // ✅ Fetch only unallotted teams
    const unallottedTeams = await Team.find(
      { _id: { $nin: [...allottedTeamIds] } },
      "teamID domain"
    );

    if (unallottedTeams.length === 0) {
      console.log("❌ No unallotted teams found.");
      return res.status(404).json({ error: "No unallotted teams found" });
    }

    console.log(`✅ Found ${unallottedTeams.length} unallotted teams.`);
    res.json(unallottedTeams);
  } catch (error) {
    console.error("❌ Error fetching unallotted teams:", error);
    res.status(500).json({ error: "Failed to fetch unallotted teams", details: error.message });
  }
};

// ✅ Fetch Panels with Populated Data
const getPanels = async (req, res) => {
  try {
    const panels = await Panel.find()
      .populate({
        path: "teacher_ids",
        select: "name",
      })
      .populate({
        path: "team_ids",
        model: "Team",
        select: "teamID domain",
      });

    res.json(panels);
  } catch (error) {
    console.error("❌ Error fetching panels:", error);
    res.status(500).json({ error: "Failed to fetch panels" });
  }
};

// ✅ Create Panel
const createPanel = async (req, res) => {
  try {
    const { teacherIds } = req.body;

    if (!teacherIds || teacherIds.length === 0) {
      return res.status(400).json({ error: "At least one teacher is required to form a panel." });
    }

    const teacherDocs = await Teacher.find({ _id: { $in: teacherIds } }, "_id");
    if (teacherDocs.length !== teacherIds.length) {
      return res.status(400).json({ error: "Some teachers were not found" });
    }

    const coordinator = await Coordinator.findOne({}, "_id");
    if (!coordinator) {
      return res.status(400).json({ error: "No coordinators found" });
    }

    const newPanel = new Panel({
      teacher_ids: teacherIds,
      team_ids: [],
      coordinator_id: coordinator._id,
    });

    await newPanel.save();

    const populatedPanel = await Panel.findById(newPanel._id).populate("teacher_ids", "name");
    res.status(201).json({ message: "Panel created successfully!", panel: populatedPanel });
  } catch (error) {
    console.error("Error creating panel:", error);
    res.status(500).json({ error: "Failed to create panel" });
  }
};

// ✅ Allot Teams to Panel
const allotTeamToPanel = async (req, res) => {
  try {
    console.log("📌 Incoming Team Allotment Request:", req.body);
    let { panelId, teamIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(panelId)) {
      return res.status(400).json({ error: "Invalid Panel ID format" });
    }

    panelId = new mongoose.Types.ObjectId(panelId);

    if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
      return res.status(400).json({ error: "At least one Team ID is required." });
    }

    const panel = await Panel.findById(panelId);
    if (!panel) {
      return res.status(404).json({ error: "Panel not found" });
    }

    // ✅ Ensure team IDs are valid
    const validTeams = await Team.find({ _id: { $in: teamIds } }, "_id");
    if (validTeams.length !== teamIds.length) {
      return res.status(400).json({ error: "Some team IDs are invalid" });
    }

    const validTeamIds = validTeams.map(team => team._id);
    panel.team_ids.push(...validTeamIds);
    await panel.save();

    const updatedPanel = await Panel.findById(panelId).populate("team_ids", "teamID domain");

    res.json({ message: "Teams allotted successfully!", updatedPanel });
  } catch (error) {
    console.error("Error allotting teams:", error);
    res.status(500).json({ error: "Failed to allot teams", details: error.message });
  }
};

// ✅ Get Coordinator ID
const getCoordinatorId = async (req, res) => {
  try {
    const coordinator = await Coordinator.findOne({}, "_id").sort({ createdAt: -1 });
    if (!coordinator) {
      return res.status(404).json({ error: "Coordinator not found" });
    }
    res.json({ coordinatorId: coordinator._id });
  } catch (error) {
    console.error("Error fetching coordinator ID:", error);
    res.status(500).json({ error: "Failed to fetch coordinator ID" });
  }
};

// ✅ Export All Functions
module.exports = {
  getAllTeachers,
  getUnallottedTeams,
  getPanels,
  createPanel,
  allotTeamToPanel,
  getCoordinatorId,
};
