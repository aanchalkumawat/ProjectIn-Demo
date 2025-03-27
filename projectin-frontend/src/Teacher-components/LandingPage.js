import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Optional styling

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSelection = (role) => {
    if (role === "teacher") {
      navigate("/login-teacher");
    }
    if (role === "student")
    {
      navigate("/login");
    }
    if (role === "coordinator")
      {
        navigate("/login");
      }
  };

  return (
    <div className="landing-container">
      <h1>Welcome to Project Inn</h1>
      <p>Select your role to proceed:</p>
      <div className="role-buttons">
        <button onClick={() => handleSelection("coordinator")}>Coordinator</button>
        <button onClick={() => handleSelection("teacher")}>Teacher</button>
        <button onClick={() => handleSelection("student")}>Student</button>
      </div>
    </div>
  );
};

export default LandingPage;
