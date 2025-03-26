import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import TeamExportPopup from "./TeamExportPopup";

const Sidebar = ({ isSidebarOpen, toggleStudentDropdown, toggleTeamDropdown, isStudentDropdownOpen, isTeamDropdownOpen, openRequestSubmissionPopup }) => {
  const [showExportPopup, setShowExportPopup] = useState(false);

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <ul>
        <li>
          <button className="sidebar-button primary" onClick={toggleStudentDropdown}>
            Student
          </button>
          {isStudentDropdownOpen && (
            <ul className="dropdown">
              <li>
                <Link to="/coordinator-dashboard/marks" className="marks-button" style={{ textDecoration: 'none' }}> 
                  <button className="secondary-button">Marks</button>
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <button className="sidebar-button primary" onClick={toggleTeamDropdown}>
            Team
          </button>
          {isTeamDropdownOpen && (
            <ul className="dropdown">
              <li>
                <button className="secondary-button" onClick={openRequestSubmissionPopup}>
                  Request Submission
                </button>
              </li>
              <li>
                <button className="export-btn" onClick={() => setShowExportPopup(true)}>
                  Team Export Details
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {showExportPopup && <TeamExportPopup onClose={() => setShowExportPopup(false)} />}
    </div>
  );
};

export default Sidebar;
