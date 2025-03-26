const Remark = require("../models/remarks");

// Add a new remark (Evaluation API)
exports.addRemark = async (req, res) => {
    try {
        const { teamId, date, remarks, description } = req.body;

        if (!teamId || !date || !remarks) {
            return res.status(400).json({ error: "Team ID, Date, and Remarks are required." });
        }

        console.log("Received Evaluation Data:", req.body);

        let existingRemark = await Remark.findOne({ teamId });

        if (existingRemark) {
            existingRemark.remarksHistory.push({ date: new Date(date), remarks, description });
            await existingRemark.save();
        } else {
            const newRemark = new Remark({
                teamId,
                remarksHistory: [{ date: new Date(date), remarks, description }],
            });
            await newRemark.save();
        }

        res.status(201).json({ message: "Evaluation submitted successfully!" });
    } catch (error) {
        console.error("Error submitting evaluation:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Fetch remarks for a specific team
exports.getRemarks = async (req, res) => {
    try {
        const teamId = decodeURIComponent(req.params.teamId);
        console.log(`Fetching remarks for Team ID: ${teamId}`);

        const teamRemarks = await Remark.findOne({ teamId });

        if (!teamRemarks || teamRemarks.remarksHistory.length === 0) {
            console.log(`No remarks found for Team ID: ${teamId}`);
            return res.json({ remarksHistory: [] });
        }

        res.json({ remarksHistory: teamRemarks.remarksHistory.map(entry => ({
            date: entry.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
            remarks: entry.remarks,
            description: entry.description || "N/A"
        })) });
    } catch (error) {
        console.error("Error fetching remarks:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};
