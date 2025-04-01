const express = require("express");
const { upload, importStudents } = require("../controllers/studentControllers");
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



// ✅ Route to Import Students from Excel
router.post("/import", upload.single("file"), importStudents);

module.exports = router;
