import React, { useState, useRef } from "react";
import "./Profile.css";

const Profile = ({ teamName, projectId, teamMembers, leader, onClose }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const profileIconRef = useRef(null);  // Ref for the profile icon

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

  const closeProfilePopup = () => {
    if (onClose) {
      onClose(); // Close the profile popup when X button is clicked
    }
  };

  return (
    <div className="profile-popup-overlay">
      <div
        className="profile-popup"
        style={{
          top: profileIconRef.current ? profileIconRef.current.offsetTop + 40 : 'auto', // Adjust top positioning
          right: 20, // Right margin for positioning
        }}
      >
        <div className="profile-header">
          <h2>Profile Information</h2>
          <button className="close-btn" onClick={closeProfilePopup}>X</button>
        </div>
        <div className="profile-body">
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
          <div className="profile-info">
            <div className="info-item">
              <strong>Team Name: </strong>
              <span>{teamName}</span>
            </div>
            <div className="info-item">
              <strong>Project ID: </strong>
              <span>{projectId}</span>
            </div>
            <div className="info-item">
              <strong>Team Members: </strong>
              <ul>
                {teamMembers.map((member, index) => (
                  <li key={index} className={member === leader ? "leader" : ""}>
                    {member} {member === leader && "(Leader)"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
