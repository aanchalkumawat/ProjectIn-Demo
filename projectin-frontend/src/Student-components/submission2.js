import React, { useState } from "react";
import axios from "axios";
import "./submission2.css";

function Submission2({ isOpen, onClose }) {
  const [reportFile, setReportFile] = useState(null);

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
        <br></br>
        <label>Upload Project Report:</label>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <br /><br />

        <div>
          <h3>File Selected:</h3>
          <p>{reportFile ? reportFile.name : "No file selected"}</p>
        </div>

        <center>
          <button className="submission2-submit-button" type="submit" onClick={handleSubmit}>
            SUBMIT
          </button>
        </center>
      </div>
    </div>
  );
}

export default Submission2;
