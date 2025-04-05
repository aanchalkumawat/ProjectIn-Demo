import React, { useState, useEffect } from "react";
import axios from "axios";
import "./submission2.css";

function Submission2({ isOpen, onClose, onSubmit }) {
  const [reportFile, setReportFile] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  // ✅ Fetch deadline on component mount
  useEffect(() => {
    const fetchDeadline = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/submission/active?type=Submission 2"
        );
        const deadlineDate = new Date(response.data.deadlineDate);
        setDeadline(deadlineDate);
        setIsDeadlinePassed(new Date() > deadlineDate);
      } catch (error) {
        console.error("Failed to fetch deadline:", error);
      }
    };

    if (isOpen) fetchDeadline(); // Fetch only when modal is open
  }, [isOpen]);

  const handleFileChange = (event) => {
    if (event.target.files.length > 1) {
      alert("You can only select one file.");
      return;
    }
    setReportFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      if (!reportFile) {
        alert("Please upload a project report.");
        return;
      }

      if (isDeadlinePassed) {
        alert("Submission deadline has passed. You cannot submit now.");
        return;
      }

      const formData = new FormData();
      formData.append("reportFile", reportFile);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/project-report/submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      onSubmit();
      onClose(); // ✅ Close modal after successful submission
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className={`submission2-modal-overlay ${isOpen ? "open" : "closed"}`}>
      <div className="submission2-form-container">
        <button className="submission2-close-btn" onClick={onClose}>
          &times;
        </button>
        <h1>Project Report Submission</h1>

        {deadline && (
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(deadline).toLocaleDateString()}{" "}
            ({isDeadlinePassed ? "⛔ Deadline Passed" : "✅ Open for submission"})
          </p>
        )}

        <div className="format">
          📥{" "}
          <a href="formats/Project Report_Guidelines.pdf" download>
            Download Project Report Guidelines For Reference
          </a>
        </div>
        <br />

        <label>Upload Project Report:</label>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <br /><br />

        <div>
          <h3>File Selected:</h3>
          <p>{reportFile ? reportFile.name : "No file selected"}</p>
        </div>

        <center>
          <button
            className="submission2-submit-button"
            type="submit"
            onClick={handleSubmit}
            disabled={isDeadlinePassed}
          >
            SUBMIT
          </button>
        </center>
      </div>
    </div>
  );
}

export default Submission2;
