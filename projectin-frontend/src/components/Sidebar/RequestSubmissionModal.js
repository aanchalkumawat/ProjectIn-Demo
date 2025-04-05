import React, { useState } from "react";
import "./RequestSubmissionModal.css";

const RequestSubmissionModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(""); // ✅ submissionType
  const [deadline, setDeadline] = useState(""); // ✅ deadlineDate

  if (!isOpen) return null;

  const handleFormSubmit = async () => {
    console.log("Submitting:", { submissionType: selectedOption, deadlineDate: deadline }); // ✅ Fixed variable names

    try {
      const token = localStorage.getItem("token");

const response = await fetch("http://localhost:5000/api/submission/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({ submissionType: selectedOption, deadlineDate: deadline }),
});

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        alert("Submission request created successfully!");
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Request Submission</h2>
        <div>
          <label className="radio-label">
            <input
              type="radio"
              name="submission"
              value="Submission 1"
              checked={selectedOption === "Submission 1"}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            Submission 1
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="submission"
              value="Submission 2"
              checked={selectedOption === "Submission 2"}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            Submission 2
          </label>
        </div>
        <div className="deadline-input">
          <label className="deadline-label">Deadline:</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-submit" onClick={handleFormSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestSubmissionModal;
