import React, { useState, useEffect } from "react";
import { FaBars, FaBell, FaCalendarAlt, FaUser  } from "react-icons/fa";
import "./StudentDashboard.css";
import Calander from "./Calander.js";
import TeamFormationForm from "./components/TeamForm.js";
import MentorForm from "./MentorForm.js";
import Submission1 from "./submission1.js";
import Submission2 from "./submission2.js";
import ProjectDetailForm from "./ProjectDetailForm";
import Profile from "./Profile"; // Import the Profile component

const Dashboard = ({ userName }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Manage visibility of popup forms
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [isMentorFormOpen, setIsMentorFormOpen] = useState(false);
  const [showSubmission1Form, setShowSubmission1Form] = useState(false);
  const [showSubmission2Form, setShowSubmission2Form] = useState(false);
  const [showProjectDetailForm, setShowProjectDetailForm] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // State to manage progress
  const [progressData, setProgressData] = useState([
    { step: "Team Creation", status: false },
    { step: "Request Mentor", status: false },
    { step: "Project Details", status: false },
    { step: "Submission 1", status: false },
    { step: "Submission 2", status: false },
  ]);

  // Profile popup state
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  // Dummy data for the profile
  const teamName = "Project In";
  const projectId = "P12345";
  const teamMembers = ["Aanchal Kumawat", "Astha shukla", "Aishwarya Verma", "Kirtika dwivedi"];
  const leader = "Aanchal Kumawat";

  // Toggle Sidebar and Calendar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCalendar = () => setShowCalendar((prev) => !prev);

  // Open/close popup forms
  const openTeamForm = () => setShowTeamForm(true);
  const closeTeamForm = () => setShowTeamForm(false);
  const handleTeamFormSubmit = () => {
    setProgressData((prevData) => {
      const updatedData = [...prevData];
      updatedData[0].status = true;
      return updatedData;
    });
    setShowTeamForm(false);
  };

  const openMentorForm = () => {
    if (progressData[0].status) setIsMentorFormOpen(true);
    else setPopupMessage("First, create the team.");
  };

  const closeMentorForm = () => {
    setIsMentorFormOpen(false);
  };

  const handleMentorFormSubmit = () => {
    setProgressData((prevData) => {
      const updatedData = [...prevData];
      updatedData[1].status = true; // Mark mentor request as completed
      return updatedData;
    });
    setIsMentorFormOpen(false);
  };

  const openSubmission1Form = () => {
    if (progressData[1].status) setShowSubmission1Form(true);
    else setPopupMessage("Please request a mentor first.");
  };

  const closeSubmission1Form = () => {
    setShowSubmission1Form(false);
  };

  const handleSubmission1FormSubmit = () => {
    setProgressData((prevData) => {
      const updatedData = [...prevData];
      updatedData[3].status = true; // Mark submission 1 as completed
      return updatedData;
    });
    setShowSubmission1Form(false);
  };

  const openSubmission2Form = () => {
    if (progressData[3].status) setShowSubmission2Form(true);
    else setPopupMessage("Please complete Submission 1 first.");
  };

  const closeSubmission2Form = () => {
    setShowSubmission2Form(false);
  };

  const handleSubmission2FormSubmit = () => {
    setProgressData((prevData) => {
      const updatedData = [...prevData];
      updatedData[4].status = true; // Mark submission 2 as completed
      return updatedData;
    });
    setShowSubmission2Form(false);
  };

  const openProjectDetailForm = () => {
    if (progressData[1].status) setShowProjectDetailForm(true);
    else setPopupMessage("Please request a mentor first.");
  };

  const closeProjectDetailForm = () => {
    setShowProjectDetailForm(false);
  };

  const handleProjectDetailFormSubmit = () => {
    setProgressData((prevData) => {
      const updatedData = [...prevData];
      updatedData[2].status = true; // Mark project details as completed
      return updatedData;
    });
    setShowProjectDetailForm(false);
  };

  // Handle clicking on progress steps
  const handleProgressCircleClick = (step) => {
    switch (step) {
      case 1:
        openTeamForm();
        break;
      case 2:
        openMentorForm();
        break;
      case 3:
        openProjectDetailForm();
        break;
      case 4:
        openSubmission1Form();
        break;
      case 5:
        openSubmission2Form();
        break;
      default:
        break;
    }
  };

  // Toggle the profile popup visibility
  const toggleProfilePopup = () => setShowProfilePopup(!showProfilePopup);

  // Update the current year
  useEffect(() => {
    const interval = setInterval(() => {
      const newYear = new Date().getFullYear();
      if (newYear !== currentYear) setCurrentYear(newYear);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentYear]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-top-bar">
        <div className="top-bar">
          {/* Hamburger Icon */}
          
          <div className="hamburger-icon" onClick={toggleSidebar}>
            <FaBars />
          </div>

          {/* Logo */}
          <div className="logo-container">
            <div className="logo" />
            
          </div>

          {/* User Name */}
          <div className="user-name">
            <h3>{userName}</h3>
          </div>

          {/* Icons */}
          <div className="icon-container">
            <FaBell className="icon" title="Notifications" />
            <div className="calendar-icon" onClick={toggleCalendar}>
              <FaCalendarAlt className="icon" title="Calendar" />
            </div>
            {showCalendar && <Calander />}
            <FaUser    
              className="icon"
              title="Profile"
              onClick={toggleProfilePopup}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <center>
            <div className="sidebar-buttons">
              <button onClick={openTeamForm}>Team Creation</button>
              <button
                onClick={openMentorForm}
                disabled={!progressData[0].status}
                style={{
                  backgroundColor: progressData[1].status ? "#4CAF50" : "#ccc",
                  cursor: progressData[0].status ? "pointer" : "not-allowed",
                }}
              >
                Request Mentor
              </button>
              <button
                onClick={openProjectDetailForm}
                disabled={!progressData[1].status}
                style={{
                  backgroundColor: progressData[2].status ? "#4CAF50" : "#ccc",
                  cursor: progressData[1].status ? "pointer" : "not-allowed",
                }}
              >
                Project Details
              </button>
              <button
                onClick={openSubmission1Form}
                disabled={!progressData[2].status}
                style={{
                  backgroundColor: progressData[3].status ? "#4CAF50" : "#ccc",
                  cursor: progressData[2].status ? "pointer" : "not-allowed",
                }}
              >
                Submission 1
              </button>
              <button
                onClick={openSubmission2Form}
                disabled={!progressData[3].status}
                style={{
                  backgroundColor: progressData[4].status ? "#4CAF50" : "#ccc",
                  cursor: progressData[3].status ? "pointer" : "not-allowed",
                }}
              >
                Submission 2
              </button>
            </div>
            <br />
            <button
              className="logout-button"
              onClick={() => alert("Logging out...")}
            >
              Logout
            </button>
          </center>
        </div>

        {/* Content */}
        <div className="content" style={{ marginLeft: isSidebarOpen ? "250px" : "0" }}>
          <center>
            <h2>Welcome to the Dashboard!</h2>
          </center>
        

        {/* Progress Bar */}
        <div className="progress-bar-container">
          {progressData.map((item, index) => (
            <div className="progress-step" key={index}>
              <div
                className={`progress-circle ${item.status ? "completed" : "pending"}`}
                onClick={() => handleProgressCircleClick(index + 1)}
              >
                {index + 1}
              </div>
              <div className="progress-text">{item.step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Forms */}
      {showTeamForm && (
        <TeamFormationForm onClose={closeTeamForm} onSubmit={handleTeamFormSubmit} />
      )}
      {isMentorFormOpen && <MentorForm isOpen={isMentorFormOpen} onClose={closeMentorForm} onSubmit={handleMentorFormSubmit} />}
      {showSubmission1Form && <Submission1 closeModal={closeSubmission1Form} onSubmit={handleSubmission1FormSubmit} />}
      {showSubmission2Form && <Submission2 closeModal={closeSubmission2Form} onSubmit={handleSubmission2FormSubmit} />}
      {showProjectDetailForm && <ProjectDetailForm onClose={closeProjectDetailForm} onSubmit={handleProjectDetailFormSubmit} />}

      {/* Profile Popup */}
      {showProfilePopup && (
        <Profile
          teamName={teamName}
          projectId={projectId}
          teamMembers={teamMembers}
          leader={leader}
          onClose={toggleProfilePopup}
        />
      )}

      {/* Popup Message */}
      {popupMessage && (
        <div className="popup-container">
          <div className="popup">
            <p>{popupMessage}</p>
            <button onClick={() => setPopupMessage("")}>Close</button>
          </div>
        </div>
      )}
    </div></div>
  );
};

export default Dashboard;