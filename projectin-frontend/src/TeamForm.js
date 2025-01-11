import React, { useState } from "react";
import axios from "axios";

const TeamForm = () => {
  const [formData, setFormData] = useState({
    teamName: "",
    leaderId: "", // This should be set dynamically based on the logged-in user
    members: [],
    projectTitle: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/team/create",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Team creation failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Team</h2>
      <input
        type="text"
        name="teamName"
        placeholder="Team Name"
        value={formData.teamName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="projectTitle"
        placeholder="Project Title"
        value={formData.projectTitle}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="leaderId"
        placeholder="Leader ID"
        value={formData.leaderId}
        onChange={handleChange}
        required
      />
      <button type="submit">Create Team</button>
    </form>
  );
};

export default TeamForm;
