import React, { useState } from "react";
import "./SetLimitsModal.css";

const SetLimitsModal = ({ isOpen, onClose, onSave }) => {
  const [maxTeams, setMaxTeams] = useState("");
  const [minMembers, setMinMembers] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let newErrors = {};

    if (!maxTeams.trim()) newErrors.maxTeams = "This field is required";
    if (!minMembers.trim()) newErrors.minMembers = "This field is required";
    if (!maxMembers.trim()) newErrors.maxMembers = "This field is required";
    if (minMembers && maxMembers && parseInt(minMembers) > parseInt(maxMembers)) {
      newErrors.maxMembers = "Max members must be greater than or equal to min members";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateFields()) {
      try {
        const response = await fetch("http://localhost:5000/api/team-limits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ maxTeams, minMembers, maxMembers }),
        });
  
        const data = await response.json();
        if (response.ok) {
          console.log("Limits Updated:", data);
          onClose();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error updating limits:", error);
      }
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Limits</h2>
        <div className="input-group">
          <label>Max Teams assigned to a Mentor:</label>
          <input
            type="number"
            value={maxTeams}
            onChange={(e) => setMaxTeams(e.target.value)}
            placeholder="Enter max teams"
          />
          {errors.maxTeams && <p className="error-text">{errors.maxTeams}</p>}
        </div>

        <div className="input-group">
          <label>Min members in a team:</label>
          <input
            type="number"
            value={minMembers}
            onChange={(e) => setMinMembers(e.target.value)}
            placeholder="Enter min members"
          />
          {errors.minMembers && <p className="error-text">{errors.minMembers}</p>}
        </div>

        <div className="input-group">
          <label>Max members in a team:</label>
          <input
            type="number"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            placeholder="Enter max members"
          />
          {errors.maxMembers && <p className="error-text">{errors.maxMembers}</p>}
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave} disabled={Object.keys(errors).length > 0}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetLimitsModal;
