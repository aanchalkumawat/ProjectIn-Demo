import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import TeamExportPopup from "./TeamExportPopup";
import ImportStudentDataPopup from "./ImportStudentDataPopup";
import ImportMentorDataPopup from "./ImportMentorDataPopup";
import ImportCoordinatorDataPopup from "./ImportCoordinatorDataPopup";

const Sidebar = ({
  isSidebarOpen,
  toggleStudentDropdown,
  toggleTeamDropdown,
  isStudentDropdownOpen,
  isTeamDropdownOpen,
  openRequestSubmissionPopup,
}) => {
  const [isTeamExportPopupOpen, setIsTeamExportPopupOpen] = useState(false);
  const [isImportDropdownOpen, setIsImportDropdownOpen] = useState(false);
  const [isStudentImportPopupOpen, setIsStudentImportPopupOpen] = useState(false);
  const [isMentorImportPopupOpen, setIsMentorImportPopupOpen] = useState(false);
  const [isCoordinatorImportPopupOpen, setIsCoordinatorImportPopupOpen] = useState(false);

  const handleFileUpload = (file, role) => {
    if (!file) {
      alert(`No file selected for ${role}.`);
      return;
    }
    console.log(`Uploading ${role} file:`, file);
    alert(`File "${file.name}" uploaded successfully for ${role}!`);
  };

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
                <Link to="/coordinator-dashboard/marks" className="marks-button">
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
                <button className="secondary-button" onClick={() => setIsTeamExportPopupOpen(true)}>
                  Export Team Details
                </button>
              </li>
            </ul>
          )}
        </li>

        <li>
          <button className="sidebar-button primary" onClick={() => setIsImportDropdownOpen(!isImportDropdownOpen)}>
            Import Data
          </button>
          {isImportDropdownOpen && (
            <ul className="dropdown">
              <li>
                <button className="secondary-button" onClick={() => setIsStudentImportPopupOpen(true)}>
                  Import Student Data
                </button>
              </li>
              <li>
                <button className="secondary-button" onClick={() => setIsMentorImportPopupOpen(true)}>
                  Import Teacher Data
                </button>
              </li>
              <li>
                <button className="secondary-button" onClick={() => setIsCoordinatorImportPopupOpen(true)}>
                  Import Coordinator Data
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {isTeamExportPopupOpen && <TeamExportPopup onClose={() => setIsTeamExportPopupOpen(false)} />}
      {isStudentImportPopupOpen && <ImportStudentDataPopup onClose={() => setIsStudentImportPopupOpen(false)} onFileUpload={handleFileUpload} />}
      {isMentorImportPopupOpen && <ImportMentorDataPopup onClose={() => setIsMentorImportPopupOpen(false)} onFileUpload={handleFileUpload} />}
      {isCoordinatorImportPopupOpen && <ImportCoordinatorDataPopup onClose={() => setIsCoordinatorImportPopupOpen(false)} onFileUpload={handleFileUpload} />}
    </div>
  );
};

export default Sidebar;
