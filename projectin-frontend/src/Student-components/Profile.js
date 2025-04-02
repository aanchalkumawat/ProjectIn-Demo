import React from "react";
import "./Profile.css";

const Profile = ({ teamName, projectId, teamMembers, leader, onClose }) => {
  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup">
        {/* Profile Header */}
        <div className="profile-header">
          <h2>Profile Information</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>

        {/* Profile Body */}
        <div className="profile-body">
          {/* Profile Information */}
          <div className="profile-info">
            <div className="info-item">
              <strong>Team ID: </strong>
              <span>{teamName || "Not Assigned"}</span>
            </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Profile;
