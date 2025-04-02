const express = require("express");
const { upload, importStudents,getStudentById } = require("../controllers/studentControllers");
const Student = require("../models/Student.js");
const router = express.Router();

router.get("/:rollno", async (req, res) => {
    const { rollno } = req.params; // Get rollno from the request URL params
    try {
        const student = await Student.findOne({ enrollmentNumber: rollno });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json({ email: student.email });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
if (!getStudentById) {
    console.error("❌ getStudentById is undefined. Check studentController.js!");
  }
  

  router.get("/:id", (req, res, next) => {
    console.log("🔍 Fetching Student ID:", req.params.id);
    next();
  }, getStudentById);

// ✅ Route to Import Students from Excel
router.post("/import", upload.single("file"), importStudents);

module.exports = router;
