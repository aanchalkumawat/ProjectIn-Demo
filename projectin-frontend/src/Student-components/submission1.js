import React from "react";
import axios from "axios";
import "./submission1.css";

function Submission1({ isOpen, onClose }) {
  const [isResearchBased, setIsResearchBased] = React.useState("");
  const [srsFile, setSrsFile] = React.useState(null);
  const [sdsFile, setSdsFile] = React.useState(null);
  const [synopsisFile, setSynopsisFile] = React.useState(null);

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
        <br></br>

        <label>Is your project Research based?</label>
        <br />
        <br />
        <input
          type="radio"
          name="researchBased"
          value="yes"
          checked={isResearchBased === "yes"}
          onChange={handleRadioChange}
        />{" "}
        Yes
        <input
          type="radio"
          name="researchBased"
          value="no"
          checked={isResearchBased === "no"}
          onChange={handleRadioChange}
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
            />
            <br />
            <br />

            <label>SDS (Software Design Specification):</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, setSdsFile)}
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
            <button className="submission1-submit-button" type="submit" onClick={handleSubmit}>
              SUBMIT
            </button>
          </center>
        </div>
      </div>
    </div>
  );
}

export default Submission1;
