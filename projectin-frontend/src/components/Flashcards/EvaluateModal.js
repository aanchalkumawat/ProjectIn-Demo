import React, { useState } from "react";
import axios from "axios";
import "./EvaluateModal.css";

const EvaluateModal = ({ onClose }) => {
  const [teamId, setTeamId] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("Good");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    let validationErrors = {};

    if (!teamId.trim()) validationErrors.teamId = "Team ID is required.";
    if (!date) validationErrors.date = "Date is required.";
    if (!remarks) validationErrors.remarks = "Remarks are required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/remarks/evaluate", {
        teamId,
        date,
        remarks,
        description,
      });

      alert(response.data.message); // Show success message
      onClose(); // Close modal after submission
    } catch (error) {
      console.error("Error submitting evaluation:", error.response?.data || error.message);
      alert("Failed to submit evaluation. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Evaluate Submission</h2>

        <label htmlFor="teamId">Team ID:</label>
        <input
          id="teamId"
          type="text"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          placeholder="Enter Team ID"
          className={errors.teamId ? "input-error" : ""}
        />
        {errors.teamId && <p className="error">{errors.teamId}</p>}

        <label htmlFor="date">Date:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={errors.date ? "input-error" : ""}
        />
        {errors.date && <p className="error">{errors.date}</p>}

        <label htmlFor="remarks">Remarks:</label>
        <select
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className={errors.remarks ? "input-error" : ""}
        >
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Better">Better</option>
          <option value="Average">Average</option>
          <option value="Poor">Poor</option>
        </select>
        {errors.remarks && <p className="error">{errors.remarks}</p>}

        <label htmlFor="description">Description (Optional):</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the team's progress..."
          rows="3"
        />

        <div className="modal-buttons">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluateModal;