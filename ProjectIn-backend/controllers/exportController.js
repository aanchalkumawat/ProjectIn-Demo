const ExcelJS = require("exceljs");
const Team = require("../models/Team");
const Project = require("../models/Project");
const Marks1 = require("../models/marks1");
const Marks2 = require("../models/marks2");

const exportTeamDetails = async (req, res) => {
  try {
    console.log("📌 Exporting Team Details...");

    // ✅ Fetch all teams
    const teams = await Team.find().lean();

    // ✅ Extract groupIDs for fetching project details
    const groupIDs = teams.map((team) => team.teamID).filter(Boolean);
    const projects = await Project.find({ groupID: { $in: groupIDs } }).lean();

    // ✅ Map projects by Group ID for quick lookup
    const projectMap = {};
    projects.forEach((project) => {
      projectMap[project.groupID] = project;
    });

    // ✅ Fetch marks1 & marks2 using enrollment number
    const allEnrollmentNumbers = teams.flatMap((team) => [
      team.teamLeader.enrollmentNumber,
      ...team.teamMembers.map((member) => member.enrollmentNumber),
    ]);

    console.log("📌 All Enrollment Numbers for Marks1 Query:", allEnrollmentNumbers);

    // ✅ Ensure we query `rollNo` as **strings** to match database values
    const marks1Data = await Marks1.find({ enrollmentNumber: { $in: allEnrollmentNumbers } }).lean();
    console.log("📌 Fetched Marks1 Data:", marks1Data);

    const marks2Data = await Marks2.find({
      rollNo: { $in: allEnrollmentNumbers },
    }).lean();

    console.log("📌 Fetched Marks1 Data:", marks1Data);
    console.log("📌 Fetched Marks2 Data:", marks2Data);

    // ✅ Map marks1 and marks2 by enrollment number
    const marks1Map = {};
    marks1Data.forEach((m) => {
      marks1Map[m.enrollmentNumber] = m.marks || 'N/A';
    });

    const marks2Map = {};
    marks2Data.forEach((m) => {
      marks2Map[m.rollNo] = (m.evalMarks1 || 0) + (m.evalMarks2 || 0);
    });

    // ✅ Create a new Excel Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Team Details");

    // ✅ Define Header Row
    worksheet.columns = [
      { header: "Group ID", key: "groupID", width: 15 },
      { header: "Names", key: "names", width: 25 },
      { header: "Roll No", key: "rollNumbers", width: 15 },
      { header: "Branch", key: "branches", width: 20 },
      { header: "Mobile No.", key: "mobile", width: 15 },
      { header: "Email", key: "emails", width: 30 },
      { header: "Research Based", key: "researchBased", width: 15 },
      { header: "Topic", key: "topic", width: 25 },
      { header: "Mentor Name", key: "mentorName", width: 20 },
      { header: "Marks1", key: "marks1", width: 10 },
      { header: "Marks2", key: "marks2", width: 10 },
    ];

    // ✅ Populate the Excel Sheet with Data
    teams.forEach((team, teamIndex) => {
      const { teamLeader, teamMembers, teamID } = team;

      const project = projectMap[teamID] || {}; // ✅ Fetch project using Group ID
      const groupID = teamID || "N/A"; 
      const researchBased = project.researchBased !== undefined ? (project.researchBased ? "Yes" : "No") : "N/A";
      const topic = project.projectName || "N/A";
      const mentorName = project.mentorName || "N/A";

      // All members including leader
      const allMembers = [
        { ...teamLeader, isLeader: true },
        ...(teamMembers || []).map((m) => ({ ...m, isLeader: false })),
      ];

      allMembers.forEach((member, index) => {
        const rollNo = member.enrollmentNumber;
        const marks1 = marks1Map[rollNo] || "N/A";
        const marks2 = marks2Map[rollNo] !== undefined ? marks2Map[rollNo] : "N/A";

        worksheet.addRow({
          groupID: index === 0 ? groupID : "", // Merged for all rows
          names: `${member.fullName} ${member.isLeader ? "(Leader)" : ""}`,
          rollNumbers: rollNo || "N/A",
          branches: member.subject || "N/A",
          mobile: member.isLeader ? member.phoneNumber || "N/A" : "", // Only leader has mobile
          emails: member.email || "N/A",
          researchBased: index === 0 ? researchBased : "", // Merged for all rows
          topic: index === 0 ? topic : "", // Merged for all rows
          mentorName: index === 0 ? mentorName : "", // Merged for all rows
          marks1: marks1, 
          marks2: marks2, 
        });
      });

      // ✅ Add an empty row between teams (except after the last team)
      if (teamIndex !== teams.length - 1) {
        worksheet.addRow({});
      }
    });

    // ✅ Save and Send File as Response
    const fileName = "TeamDetails.xlsx";
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();
    console.log("✅ Excel Exported Successfully!");
  } catch (error) {
    console.error("❌ Error exporting team details:", error);
    res.status(500).json({ error: "Failed to export team details" });
  }
};

module.exports = { exportTeamDetails };
