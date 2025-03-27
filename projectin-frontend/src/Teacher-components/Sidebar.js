import React, { useState, useEffect, useRef } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import axios from "axios";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isInPanel, setIsInPanel] = useState(false); // ✅ Check if mentor is in panel

  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null); // Ref for dropdown

  const mentor = JSON.parse(localStorage.getItem("mentor")); // ✅ Get current mentor

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDropdown = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSkillChange = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/mentor-dashboard");
    }
  };
  // Fetch panel data to check if mentor is part of any panel
  const checkPanelMembership = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/panel");
      const panels = response.data;
      const mentorId = mentor?.id;

      // Check if mentorId exists in any panel's teacher_ids
      const isInPanel = panels.some((panel) =>
        panel.teacher_ids.includes(mentorId)
      );
      setIsInPanel(isInPanel);
      console.log("Is Mentor in Panel?", isInPanel);
    } catch (error) {
      console.error("Error fetching panels:", error);
    }
  };
// Fetch on component mount
useEffect(() => {
  if (mentor?.id) {
    checkPanelMembership();
  }
}, [mentor]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".navbar-icon")&&
        !event.target.closest(".dropdown") // Prevent closing when clicking inside dropdown
      
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <div className="navbar-icon" onClick={toggleSidebar}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? "open" : ""}`}>

        <button className="sidebar-btn" onClick={handleHomeClick}>Home</button>  
          <button
          className={`sidebar-btn ${isInPanel ? "" : "disabled"}`}
          onClick={() =>
            isInPanel && navigate("/evaluation-panel")
          }
          disabled={!isInPanel}
        >
          Evaluation Panel
        </button>
      </div>
    </>
  );
};

export default Sidebar;
