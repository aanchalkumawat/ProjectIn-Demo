import React, { useState } from "react";
import { FaBars, FaBell, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import Calander from "../Student-components/Calander.js";
import TeamFormationForm from "../Student-components/TeamForm.js";
import MentorForm from "../Student-components/MentorForm.js";
import Submission1 from "../Student-components/submission1.js";
import Submission2 from "../Student-components/submission2.js";
import ProjectDetailForm from "../Student-components/ProjectDetailForm";
import Profile from "../Student-components/Profile";

const Dashboard = ({ userName }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Popup form states
  const [openForm, setOpenForm] = useState(null); // Stores which form is open

  // Progress bar state
  const [progressData, setProgressData] = useState([
    { step: "Team", status: false },
    { step: "Mentor", status: false },
    { step: "Project", status: false },
    { step: "Submission1", status: false },
    { step: "Submission2", status: false },
  ]);

  // Toggle Sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Toggle Calendar
  const toggleCalendar = () => setShowCalendar((prev) => !prev);

  // Open form by setting `openForm`
  const openSpecificForm = (formName) => {
    setOpenForm(formName);
  };

  // Close any open form
  const closeForm = () => {
    setOpenForm(null);
  };

  // Form Submission Handler (Updates Progress Bar)
  const handleFormSubmit = (formIndex) => {
    setProgressData((prev) => {
      const updated = [...prev];
      updated[formIndex].status = true; // Mark as completed
      return updated;
    });
    closeForm();
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="dashboard-top-bar">
        <div className="top-bar">
          <div className="hamburger-icon" onClick={toggleSidebar}>
            <FaBars />
          </div>

          <div className="logo-container">
            <div className="logo" />
          </div>

          <div className="user-name">
            <h3>{userName}</h3>
          </div>

          <div className="icon-container">
            <FaBell className="icon" title="Notifications" />
            <div className="calendar-icon" onClick={toggleCalendar}>
              <FaCalendarAlt className="icon" title="Calendar" />
            </div>
            {showCalendar && <Calander />}
            <FaUser className="icon" title="Profile" />
          </div>
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <center>
            <div className="sidebar-buttons">
              <button onClick={() => openSpecificForm("Team")}>Team Creation</button>
              <button onClick={() => openSpecificForm("Mentor")}>Request Mentor</button>
              <button onClick={() => openSpecificForm("Project")}>Project Details</button>
              <button onClick={() => openSpecificForm("Submission1")}>Submission 1</button>
              <button onClick={() => openSpecificForm("Submission2")}>Submission 2</button>
            </div>
            <br />
            <button className="logout-button" onClick={() => navigate("/login")}>
              Logout
            </button>
          </center>
        </div>

        {/* Content */}
        <div className="content" style={{ marginLeft: isSidebarOpen ? "250px" : "0" }}>
          <center>
            <h2>Welcome to the Dashboard!</h2>
          </center>

          {/* Progress Bar (Now Clickable) */}
          <div className="progress-bar-container">
            {progressData.map((item, index) => (
              <div
                key={index}
                className="progress-step"
                onClick={() => openSpecificForm(item.step)} // Click to open form
                style={{ cursor: "pointer" }}
              >
                <div className={`progress-circle ${item.status ? "completed" : "pending"}`}>
                  {index + 1}
                </div>
                <div className="progress-text">{item.step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup Forms (Only one open at a time) */}
      {openForm === "Team" && (
        <TeamFormationForm 
          isOpen={openForm === "Team"} 
          onClose={closeForm} 
          onSubmit={() => handleFormSubmit(0)} 
        />
      )}
      {openForm === "Mentor" && (
        <MentorForm 
          isOpen={openForm === "Mentor"} 
          onClose={closeForm} 
          onSubmit={() => handleFormSubmit(1)} 
        />
      )}
      {openForm === "Project" && (
        <ProjectDetailForm 
          isOpen={openForm === "Project"} 
          onClose={closeForm} 
          onSubmit={() => handleFormSubmit(2)} 
        />
      )}
      {openForm === "Submission1" && (
        <Submission1 
          isOpen={openForm === "Submission1"} 
          onClose={closeForm} 
          onSubmit={() => handleFormSubmit(3)} 
        />
      )}
      {openForm === "Submission2" && (
        <Submission2 
          isOpen={openForm === "Submission2"} 
          onClose={closeForm} 
          onSubmit={() => handleFormSubmit(4)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
