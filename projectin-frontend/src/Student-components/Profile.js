import React, { useState } from "react";
import "./Profile.css";

const Profile = ({ teamName, projectId, teamMembers, leader, onClose }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  // Function to handle profile picture upload
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
          {/* Profile Picture Section */}
          <div className="profile-picture-container">
            <div
              className="profile-picture"
              style={{
                backgroundImage: `url(${profilePicture || "default-profile.jpg"})`,
              }}
            ></div>
            <label htmlFor="profile-upload" className="upload-btn">
              {profilePicture ? "Change Profile Picture" : "Add Profile Picture"}
            </label>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfilePictureChange}
            />
          </div>

          {/* Profile Information */}
          <div className="profile-info">
            <div className="info-item">
              <strong>Team Name: </strong>
              <span>{teamName || "Not Assigned"}</span>
            </div>
            <div className="info-item">
              <strong>Project ID: </strong>
              <span>{projectId || "N/A"}</span>
            </div>
            <div className="info-item">
              <strong>Team Members: </strong>
              <ul>
                {teamMembers && teamMembers.length > 0 ? (
                  teamMembers.map((member, index) => (
                    <li key={index} className={member === leader ? "leader" : ""}>
                      {member} {member === leader && "(Leader)"}
                    </li>
                  ))
                ) : (
                  <li>No Team Members Assigned</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
