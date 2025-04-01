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

const Dashboard = ({ userName }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [openForm, setOpenForm] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [progressData, setProgressData] = useState([
    { step: "Team", status: false },
    { step: "Mentor", status: false },
    { step: "Project", status: false },
    { step: "Submission1", status: false },
    { step: "Submission2", status: false },
  ]);

  // Fetch notifications
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/notifications/all")
      .then((res) => res.data.success && setNotifications(res.data.data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  // Toggle Sidebar
  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);

  // Toggle Calendar
  const toggleCalendar = useCallback(() => setShowCalendar((prev) => !prev), []);

  // Toggle Notification Popup
  const toggleNotifications = useCallback(() => setIsNotificationOpen((prev) => !prev), []);

  // Open specific form
  const openSpecificForm = useCallback((formName) => setOpenForm(formName), []);

  // Close form
  const closeForm = useCallback(() => setOpenForm(null), []);

  // Handle form submission & update progress
  const handleFormSubmit = useCallback((formIndex) => {
    setProgressData((prev) =>
      prev.map((item, idx) => (idx === formIndex ? { ...item, status: true } : item))
    );
    closeForm();
  }, [closeForm]);

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="dashboard-top-bar">
        <div className="top-bar">
          <FaBars className="icon" onClick={toggleSidebar} />
          <div className="logo-container">
            <div className="logo" />
            <div className="our-logo">
            </div>
          </div>
          <h3>{userName}</h3>
          <div className="icon-container">
            <FaClipboard className="icon" title="Notifications" onClick={toggleNotifications} />
            {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
            <FaCalendarAlt className="icon" title="Calendar" onClick={toggleCalendar} />
            <FaUser className="icon" title="Profile" />
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
        <button className="logout-button" onClick={() => navigate("/login")}>
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="content">
        <h2>Welcome to the Dashboard!</h2>

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

          {/* Background Overlay */}
        {isNotificationOpen && <div className="overlay" onClick={toggleNotifications}></div>} 
      {/* Notification Popup */}
      {isNotificationOpen && (
        <div className="notification-popup">
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
          <button onClick={toggleNotifications}>close</button>
        </div>
      )}

      {/* Popup Forms */}
      {openForm === "Team" && <TeamFormationForm isOpen onClose={closeForm} onSubmit={() => handleFormSubmit(0)} />}
      {openForm === "Mentor" && <MentorForm isOpen onClose={closeForm} onSubmit={() => handleFormSubmit(1)} />}
      {openForm === "Project" && <ProjectDetailForm isOpen onClose={closeForm} onSubmit={() => handleFormSubmit(2)} />}
      {openForm === "Submission1" && <Submission1 isOpen onClose={closeForm} onSubmit={() => handleFormSubmit(3)} />}
      {openForm === "Submission2" && <Submission2 isOpen onClose={closeForm} onSubmit={() => handleFormSubmit(4)} />}
    </div>
  );
};

export default Dashboard;
