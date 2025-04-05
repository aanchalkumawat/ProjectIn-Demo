import React, { useEffect, useState } from "react";
import axios from "axios";
import "./submission1.css";

function Submission1({ isOpen, onClose, onSubmit }) {
  const [isResearchBased, setIsResearchBased] = useState("");
  const [srsFile, setSrsFile] = useState(null);
  const [sdsFile, setSdsFile] = useState(null);
  const [synopsisFile, setSynopsisFile] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [isDeadlineOver, setIsDeadlineOver] = useState(false); // 🆕

  useEffect(() => {
    const fetchDeadline = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/submission/active?type=Submission%201",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const deadlineDate = new Date(res.data.deadlineDate);
        setDeadline(deadlineDate);

        // Check if deadline has passed
        if (new Date() > deadlineDate) {
          setIsDeadlineOver(true);
        }
      } catch (error) {
        console.error("Failed to fetch deadline:", error);
      }
    };

    if (isOpen) fetchDeadline();
  }, [isOpen]);

  const handleRadioChange = (event) => {
    setIsResearchBased(event.target.value);
    setSrsFile(null);
    setSdsFile(null);
    setSynopsisFile(null);
  };

  const handleFileChange = (event, setter) => {
    if (event.target.files.length > 1) {
      alert("You can only select one file.");
      return;
    }
    setter(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      if (isDeadlineOver) {
        alert("Deadline is over. Submission not allowed.");
        return;
      }

      if (!isResearchBased) {
        alert("Please select whether your project is research-based.");
        return;
      }

      const formData = new FormData();
      formData.append("isResearchBased", isResearchBased);

      if (isResearchBased === "yes" && synopsisFile) {
        formData.append("synopsis", synopsisFile);
      } else if (isResearchBased === "no") {
        if (srsFile) formData.append("srs", srsFile);
        if (sdsFile) formData.append("sds", sdsFile);
      } else {
        alert("Please upload the required files before submitting.");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/submission",
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
      onClose(); // ✅ Close modal after submission
    } catch (error) {
      console.error("Error submitting project:", error);
      alert(
        error.response?.data?.message || "Submission failed. Please try again."
      );
    }
  };

  return (
    <div className={`submission1-modal-overlay ${isOpen ? "open" : "closed"}`}>
      <div className="submission1-form-container">
        <button className="submission1-close-btn" onClick={onClose}>
          &times;
        </button>
        <h1>SRS & SDS / Synopsis Submission</h1>
        <br />

        {/* 📅 Deadline Display */}
        {deadline && (
          <p className="submission1-deadline">
            🕒 Deadline:{" "}
            <strong>
              {deadline.toLocaleString("en-IN", {
                weekday: "short",
                year: "numeric",
                month: "short",
              })}
            </strong>
          </p>
        )}

        {isDeadlineOver && (
          <p className="submission1-deadline" style={{ color: "red" }}>
            ⛔ Deadline is over. Submission is disabled.
          </p>
        )}

        <div className="format">
          📥 <a href="/formats/SRS Format.pdf" download>Download SRS Format For Reference</a>
          <br />
          📥 <a href="/formats/SDS Format.pdf" download>Download SDS Format For Reference</a>
          <br />
          📥 <a href="/formats/Synopsis format.pdf" download>Download Synopsis Format For Reference</a>
        </div>
        <br />

        <label>Is your project Research based?</label>
        <br />
        <br />
        <input
          type="radio"
          name="researchBased"
          value="yes"
          checked={isResearchBased === "yes"}
          onChange={handleRadioChange}
          disabled={isDeadlineOver}
        />{" "}
        Yes
        <input
          type="radio"
          name="researchBased"
          value="no"
          checked={isResearchBased === "no"}
          onChange={handleRadioChange}
          disabled={isDeadlineOver}
        />{" "}
        No
        <br />
        <br />

        {isResearchBased === "yes" && (
          <div>
            <label>Synopsis (Research-based projects only):</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, setSynopsisFile)}
              disabled={isDeadlineOver}
            />
            <br />
            <br />
          </div>
        )}

        {isResearchBased === "no" && (
          <div>
            <label>SRS (Software Requirement Specification):</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, setSrsFile)}
              disabled={isDeadlineOver}
            />
            <br />
            <br />

            <label>SDS (Software Design Specification):</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, setSdsFile)}
              disabled={isDeadlineOver}
            />
            <br />
            <br />
          </div>
        )}

        <div>
          <h3>Files Selected:</h3>
          {isResearchBased === "yes" ? (
            <p>Synopsis: {synopsisFile ? synopsisFile.name : "No file selected"}</p>
          ) : (
            <>
              <p>SRS: {srsFile ? srsFile.name : "No file selected"}</p>
              <p>SDS: {sdsFile ? sdsFile.name : "No file selected"}</p>
            </>
          )}
          <center>
            <button
              className="submission1-submit-button"
              type="submit"
              onClick={handleSubmit}
              disabled={isDeadlineOver}
            >
              SUBMIT
            </button>
          </center>
        </div>
      </div>
    </div>
  );
}

export default Submission1;
