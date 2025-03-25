import React, { useState } from "react";
import axios from "axios";
import "./ProjectDetailForm.css";

const ProjectDetailForm = ({ onClose, onSubmit }) => {
  const [groupID, setGroupID] = useState("");
  const [projectName, setProjectName] = useState(""); // ✅ Added
  const [mentorName, setMentorName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [isResearchBased, setIsResearchBased] = useState(false); // ✅ Checkbox state

  const handleSubmit = async () => {
    if (!groupID || !projectName || !mentorName || !domain || !description) {
      alert("All fields are required.");
      return;
    }

    const projectData = {
      groupID,
      projectName,
      mentorName,
      domain,
      description,
      researchBased: isResearchBased, // ✅ Sending research-based value
    };

    console.log("📤 Sending data to backend:", projectData); // ✅ Debugging

    try {
      const response = await axios.post("http://localhost:5000/api/projects", projectData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Sending JWT token
        },
      });

      console.log("✅ Response from server:", response.data);
      alert("Project submitted successfully!");
      onSubmit(); // ✅ Refresh list after submission
      onClose(); // ✅ Close the popup after submission
    } catch (error) {
      console.error("❌ Error submitting project:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to submit project.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="project-form-container">
        <h1>Project Details</h1>
        <button className="project-close-btn" onClick={onClose}>✖</button>
        <div className="project-form">
          <label>Group ID:</label>
          <input type="text" placeholder="Enter your group ID" value={groupID} onChange={(e) => setGroupID(e.target.value)} required /><br />

          <label>Project Name:</label> {/* ✅ Added Project Name */}
          <input type="text" placeholder="Enter project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} required /><br />

          <label>Mentor Name:</label>
          <input type="text" placeholder="Enter mentor name" value={mentorName} onChange={(e) => setMentorName(e.target.value)} required /><br />

          <label>Domain of your Project:</label>
          <select value={domain} onChange={(e) => setDomain(e.target.value)} required>
            <option value="" disabled>--Select Domain--</option>
            <option value="standalone-web">Standalone Web Application</option>
            <option value="android">Android Based Project</option>
            <option value="arvr">AR/VR</option>
            <option value="web-based">Web Based Project</option>
          </select><br />

          <label>Project Description:</label>
          <textarea placeholder="Enter project description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea><br />

          <label>
            <input
              type="checkbox"
              checked={isResearchBased}
              onChange={(e) => setIsResearchBased(e.target.checked)}
            /> Research-Based Project
          </label> {/* ✅ Added checkbox for research-based project */}

          <center>
            <button className="project-submit-button" onClick={handleSubmit}>
              Submit
            </button>
          </center>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailForm;
