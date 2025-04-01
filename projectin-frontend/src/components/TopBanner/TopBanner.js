import React from "react";
import "./TopBanner.css";
import logo from "../../assests/images/Banasthali_Vidyapeeth_Logo.png"; // Adjust path if needed  
import logo2 from "../../images/logo2.png"

const TopBanner = ({ toggleSidebar, toggleProfileDropdown, isProfileDropdownOpen, handleLogout }) => {
  return (
    <div className="top-banner">
      <div className="top-left">
        <i className="icon-menu" onClick={toggleSidebar}></i>
        <img src={logo} alt="Banasthali Vidyapeeth Logo" className="coordinator-logo" />
        <img src={logo2} alt="Banasthali Vidyapeeth Logo" className="coordinator-our-logo" />
        <div className="brand-title">
        <span className="brand-title">Coordinator Dashboard</span>
        </div>
      </div>
      <div className="top-right">
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
