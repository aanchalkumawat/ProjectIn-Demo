const mongoose = require("mongoose");
const Teacher = require("../models/Teacher");
const Team = require("../models/Team");
const Panel = require("../models/Panel");
const Coordinator = require("../models/Coordinator");
const Project = require("../models/Project");
// ✅ Fetch All Teachers
const getAllTeachers = async (req, res) => {
  try {
    // Fetch all teachers
    const allTeachers = await Teacher.find({}, "_id name");
    
    // Fetch teachers already assigned to a panel
    const assignedPanels = await Panel.find({}, "teacher_ids");
    const assignedTeacherIds = new Set(
      assignedPanels.flatMap((panel) => panel.teacher_ids.map((id) => id.toString()))
    );

    // Debugging: Print assigned teacher IDs
    console.log("Assigned Teacher IDs:", assignedTeacherIds);

    // Filter out assigned teachers
    const unassignedTeachers = allTeachers.filter((teacher) => !assignedTeacherIds.has(teacher._id.toString()));

    // Debugging: Print unassigned teachers
    console.log("Unassigned Teachers:", unassignedTeachers);

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
    // ✅ Fetch all allotted team IDs from the Panel model
    const allottedTeams = await Panel.find({}, "team_ids"); 
    console.log("✅ Allotted Teams:", allottedTeams);

    const allottedTeamIds = new Set(allottedTeams.flatMap(panel => (panel.team_ids ? panel.team_ids.map(id => id.toString()) : [])));
    console.log("✅ Allotted Team IDs:", allottedTeamIds);

    // ✅ Fetch teams directly from the `projects` model, excluding those in `allottedTeamIds`
    const unallottedTeams = await Project.find(
      { _id: { $nin: [...allottedTeamIds] } }, // ✅ Exclude already allotted teams
      "groupID domain" // ✅ Only fetch groupID and domain
    );
    console.log("✅ Unallotted Teams:", unallottedTeams);
    if (!unallottedTeams.length) {
      console.warn("⚠ No unallotted teams found.");
      return res.status(404).json({ error: "No unallotted teams found" });
    }

    res.json(unallottedTeams);
  } catch (error) {
    console.error("Error fetching unallotted teams:", error);
    res.status(500).json({ error: "Failed to fetch unallotted teams", details: error.message });
  }
};


const getPanels = async (req, res) => {
  try {
    const panels = await Panel.find()
      .populate({
        path: "teacher_ids",
        select: "name",
      })
      .populate({
        path: "team_ids",
        model: "Project", // ✅ Fetch from Project model
        select: "groupID domain", // ✅ Fetch groupID and domain
      });

    if (!panels || panels.length === 0) {
      return res.json([]);
    }

    console.log("✅ Updated Panel Data with Populated Teams:", JSON.stringify(panels, null, 2)); // Debugging
    res.json(panels);
  } catch (error) {
    console.error("❌ Error fetching panels:", error);
    res.status(500).json({ error: "Failed to fetch panels" });
  }
};


const createPanel = async (req, res) => {
  try {
    const { teacherIds } = req.body;

    if (!teacherIds || teacherIds.length === 0) {
      return res.status(400).json({ error: "At least one teacher is required to form a panel." });
    }

    // Ensure all teachers exist
    const teacherDocs = await Teacher.find({ _id: { $in: teacherIds } }, "_id");
    if (teacherDocs.length !== teacherIds.length) {
      return res.status(400).json({ error: "Some teachers were not found" });
    }

    // Fetch a coordinator
    const coordinator = await Coordinator.findOne({}, "_id");
    if (!coordinator) {
      return res.status(400).json({ error: "No coordinators found" });
    }

    // Create a new panel
    const newPanel = new Panel({
      teacher_ids: teacherIds,
      team_ids: [],
      coordinator_id: coordinator._id
    });

    await newPanel.save();

    // ✅ Fetch the newly created panel WITH POPULATED TEACHER NAMES
    const populatedPanel = await Panel.findById(newPanel._id).populate("teacher_ids", "name");

    console.log("Created Panel (Populated):", populatedPanel); // ✅ Debugging

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

    // ✅ Convert to ObjectId if it's not
    if (!mongoose.Types.ObjectId.isValid(panelId)) {
      return res.status(400).json({ error: "Invalid Panel ID format" });
    }

    panelId = new mongoose.Types.ObjectId(panelId);

    if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
      return res.status(400).json({ error: "At least one Team ID is required." });
    }
     
    console.log("✅ Valid Team IDs:", teamIds);

    const panel = await Panel.findById(panelId);
    if (!panel) {
      console.error("❌ No Team IDs provided!");
      return res.status(404).json({ error: "Panel not found" });
    }
    console.log("✅ Found Panel:", panel);

    // ✅ Ensure team IDs are valid
    const validTeams = await Project.find({ _id: { $in: teamIds } }, "_id");
    if (validTeams.length !== teamIds.length) {
      console.error("❌ Some Team IDs are invalid:", teamIds);
      return res.status(400).json({ error: "Some team IDs are invalid" });
    }

    const validTeamIds = validTeams.map(team => team._id);

    panel.team_ids.push(...validTeamIds);
    await panel.save();

    // ✅ Fetch updated panel
    const updatedPanel = await Panel.findById(panelId).populate("team_ids", "groupID domain");

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




// ✅ Corrected Export (Include all functions)
module.exports = {
  getAllTeachers,
  getUnallottedTeams,
  getPanels,
  createPanel,
  allotTeamToPanel,
  getCoordinatorId,
};
