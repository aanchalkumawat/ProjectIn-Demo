import React, { useState } from "react";
import axios from "axios";
//import "./TeamFormationForm.css";
const TeamForm = () => {
  const [formData, setFormData] = useState({ teamName: "", projectTitle: "" });
  const [teamId, setTeamId] = useState(null); // Store the created team's ID
  const [memberEmail, setMemberEmail] = useState(""); // Email for inviting members
  const [invitedMembers, setInvitedMembers] = useState([]); // List of invited members

  // Handle input change for team creation
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle input change for member email
  const handleEmailChange = (e) => {
    setMemberEmail(e.target.value);
  };

  // Create a new team
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/team/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message);
      setTeamId(res.data.team._id); // Store the created team's ID
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team");
    }
  };

  // Invite a new member
  const handleInvite = async () => {
    if (!teamId) {
      alert("Please create a team first.");
      return;
    }

    if (!memberEmail.trim()) {
      alert("Please enter a valid email.");
      return;
    }

    if (invitedMembers.length >= 5) {
      alert("You can only invite up to 5 members.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/team/invite",
        { teamId, email: memberEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message);

      // Add the invited member to the list
      setInvitedMembers((prev) => [
        ...prev,
        { email: memberEmail, status: "pending" },
      ]);
      setMemberEmail(""); // Clear the email input
    } catch (error) {
      console.error("Error inviting member:", error);
      alert("Failed to send invitation.");
    }
  };

  return (
    <div>
      {/* Team Creation Form */}
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
        <button type="submit">Create Team</button>
      </form>

      {/* Member Invitation Section */}
      {teamId && (
        <div>
          <h3>Invite Members</h3>
          <input
            type="email"
            placeholder="Enter member email"
            value={memberEmail}
            onChange={handleEmailChange}
          />
          <button type="button" onClick={handleInvite}>
            Send Invite
          </button>

          {/* Display Pending Invitations */}
          <h4>Pending Invitations</h4>
          {invitedMembers.length > 0 ? (
            <ul>
              {invitedMembers.map((member, index) => (
                <li key={index}>
                  {member.email} - {member.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending invitations.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamForm;

