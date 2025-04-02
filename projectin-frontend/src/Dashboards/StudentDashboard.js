import React, { useState, useEffect, useCallback } from "react";
import { FaBars, FaClipboard, FaCalendarAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentDashboardmodule.css";
import Calander from "../Student-components/Calander.js";
import TeamFormationForm from "../Student-components/TeamForm.js";
import MentorForm from "../Student-components/MentorForm.js";
import Submission1 from "../Student-components/submission1.js";
import Submission2 from "../Student-components/submission2.js";
import ProjectDetailForm from "../Student-components/ProjectDetailForm";
import Profile from "../Student-components/Profile.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [openForm, setOpenForm] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const progressSteps = ["Team", "Mentor", "Project", "Submission1", "Submission2"];
  const [progressData, setProgressData] = useState(
    progressSteps.map((step) => ({ step, status: false }))
  );

  // Fetch user details from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      console.log("✅ User Data Loaded from localStorage:", storedUser);
      setUserData(storedUser);
    } else {
      console.error("🚨 No user data found in localStorage!");
      navigate("/login"); // Redirect to login if user data is missing
    }
  }, [navigate]);

  // Fetch notifications
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/notifications/all")
      .then((res) => res.data.success && setNotifications(res.data.data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  // Toggle functions
  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const toggleCalendar = useCallback(() => setShowCalendar((prev) => !prev), []);
  const toggleNotifications = useCallback(() => setIsNotificationOpen((prev) => !prev), []);
  const toggleProfile = useCallback(() => setIsProfileOpen((prev) => !prev), []);

  // Handle form actions
  const openSpecificForm = useCallback((formName) => setOpenForm(formName), []);
  const closeForm = useCallback(() => setOpenForm(null), []);

  const handleFormSubmit = useCallback((formIndex) => {
    setProgressData((prev) =>
      prev.map((item, idx) => (idx === formIndex ? { ...item, status: true } : item))
    );
    closeForm();
  }, [closeForm]);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="dashboard-top-bar">
        <div className="top-bar">
          <FaBars className="icon" onClick={toggleSidebar} />
          <div className="logo-container">
            <div className="logo" />
            <div className="our-logo"></div>
          </div>
          <div className="icon-container">
            <FaClipboard className="icon" title="Notifications" onClick={toggleNotifications} />
            {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
            <FaCalendarAlt className="icon" title="Calendar" onClick={toggleCalendar} />
            <FaUser className="icon" title="Profile" onClick={toggleProfile} />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-buttons">
          {progressData.map((item, index) => (
            <button key={index} onClick={() => openSpecificForm(item.step)}>
              {item.step} {item.status && "✅"}
            </button>
          ))}
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="content">
      <h2>Welcome to the Dashboard {userData?.team?.teamID ? `- Team ${userData.team.teamID}` : ""}!</h2>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          {progressData.map((item, index) => (
            <div key={index} className="progress-step" onClick={() => openSpecificForm(item.step)}>
              <div className={`progress-circle ${item.status ? "completed" : "pending"}`}>
                {index + 1}
              </div>
              <div className="progress-text">{item.step}</div>
            </div>
          ))}
        </div>

        {/* Calendar Component */}
        {showCalendar && <Calander />}
      </div>

      {/* Background Overlay for Notifications */}
      {isNotificationOpen && <div className="overlay" onClick={toggleNotifications}></div>}

      {/* Notification Popup */}
      {isNotificationOpen && (
        <div className="student-notification-popup">
          <div className="notification-header">
            <h2>📢 Notices</h2>
          </div>
          <ul className="notification-list">
            {notifications.length === 0 ? (
              <li>No new notifications</li>
            ) : (
              notifications.map((note, index) => <li key={index}>{note.message}</li>)
            )}
          </ul>
          <button className="notice-button"onClick={toggleNotifications}>Close</button>
        </div>
      )}

      {/* Profile Popup */}
      {isProfileOpen && userData && userData.team && (
        <Profile
          teamName={userData.team.teamID}
          projectId={userData.team.domain}
          teamMembers={userData.team.members || []}
          leader={userData.team.leader}
          onClose={toggleProfile}
        />
      )}

      {/* Popup Forms */}
      {openForm && (
        <>
          {openForm === "Team" && <TeamFormationForm isOpen onClose={closeForm} onSubmit={() => handleFormSubmit(0)} />}
          {openForm === "Mentor" && <MentorForm isOpen onClose={closeForm} onSubmit={() => handleFormSubmit(1)} />}
          {openForm === "Project" && <ProjectDetailForm isOpen onClose={closeForm} onSubmit={() => handleFormSubmit(2)} />}
          {openForm === "Submission1" && <Submission1 isOpen onClose={closeForm} onSubmit={() => handleFormSubmit(3)} />}
          {openForm === "Submission2" && <Submission2 isOpen onClose={closeForm} onSubmit={() => handleFormSubmit(4)} />}
        </>
      )}
    </div>
  );
};

export default Dashboard;
