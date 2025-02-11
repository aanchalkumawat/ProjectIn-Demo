import React, { useState } from 'react';
import './ProjectDetailForm.css';

const ProjectDetailForm = ({ onClose, onSubmit }) => {
  const [groupID, setGroupID] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [domain, setDomain] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!groupID || !mentorName || !domain || !description) {
      alert("All fields are required.");
      return;
    }

    const projectData = { groupID, mentorName, domain, description };
    onSubmit(projectData); // Send data to the backend via StudentDashboard.js
  };

  return (
    <div className="popup-overlay">
      <div className="project-form-container">
        <h1>Project Details</h1>
        <button className="project-close-btn" onClick={onClose}>✖</button>
        <div className="project-form">
          <label>Group ID:</label>
          <input type="text" placeholder="Enter your group ID" value={groupID} onChange={(e) => setGroupID(e.target.value)} required /><br />

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
