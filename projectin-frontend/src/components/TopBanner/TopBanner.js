import React from "react";
import "./TopBanner.css";

const TopBanner = ({ toggleSidebar, toggleProfileDropdown, isProfileDropdownOpen, handleLogout }) => {
  return (
    <div className="top-banner">
      <div className="top-left">
        <i className="icon-menu" onClick={toggleSidebar}></i>
        <span className="brand-title">Coordinator Dashboard</span>
      </div>
      <div className="top-right">
        <div className="notification-icon">
          <i className="icon-bell">&#128276;</i>
          <span className="badge">3</span>
        </div>
        <div
          className="profile-container"
          onClick={toggleProfileDropdown}
          role="button"
          tabIndex={0}
        >
          <div className="profile-icon">&#128100;</div>
          {isProfileDropdownOpen && (
            <ul className="profile-dropdown">
              <li onClick={handleLogout}>Logout</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
