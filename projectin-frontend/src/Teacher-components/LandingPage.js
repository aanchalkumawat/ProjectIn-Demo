import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Optional 
import background from "../assests/images/banner1.jpeg";
import Footer from "./Footer1"; 
import logo from "../assests/images/Banasthali_Vidyapeeth_Logo.png"; // Import Logo

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSelection = (role) => {
    const routes = {
      teacher: "/login-teacher",
      student: "/login",
      coordinator: "/login",
    };
    navigate(routes[role]);
  };
  return (
    <div className="landing-page" style={{ backgroundImage: `url(${background})` }}>
      
      {/* Top Banner with Logo & Title */}
      <div className="top-banner">
        <img src={logo} alt="Banasthali Logo" className="banner-logo" />
        <span className="banner-text">BANASTHALI VIDYAPITH</span>
      </div>

      {/* Landing Page Content */}
      <div className="landing-container">
      <h1>Welcome to Project Inn</h1>
      <p>Select your role to proceed:</p>
      <div className="role-buttons">
        <button onClick={() => handleSelection("coordinator")}>Coordinator</button>
        <button onClick={() => handleSelection("teacher")}>Teacher</button>
        <button onClick={() => handleSelection("student")}>Student</button>
      </div>
    </div>

      {/* Footer Component */}
      <Footer />
    </div>
    
  )
};

export default LandingPage;
