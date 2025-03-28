import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TeamForm.css"; // ✅ Regular CSS for styling

const TeamForm = ({ onClose }) => {
  const [teamLeader, setTeamLeader] = useState({
    fullName: "",
    enrollmentNumber: "",
    email: "",
    phoneNumber: "",
    subject: "CS", // Default selection
  });

  const [teamSize, setTeamSize] = useState(1);
  const [teamMembers, setTeamMembers] = useState([{ fullName: "", enrollmentNumber: "", subject: "CS" }]);
  const [isFrozen, setIsFrozen] = useState(false); // ✅ Freeze Status State

  // ✅ Fetch freeze status on component mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/team-freeze/freeze-status")
      .then(response => {
        setIsFrozen(response.data.isFrozen);
      })
      .catch(error => {
        console.error("Error fetching freeze status:", error);
      });
  }, []);

  // Function to update team members list
  const handleAddMember = () => {
    setTeamMembers([...teamMembers, { fullName: "", enrollmentNumber: "", subject: "CS" }]);
    setTeamSize(teamSize + 1);
  };

  // ✅ Remove a Team Member
  const handleRemoveMember = (index) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
    setTeamSize(teamSize - 1);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // ✅ Validate Required Fields
    if (!teamLeader.fullName || !teamLeader.enrollmentNumber || !teamLeader.email || !teamLeader.phoneNumber || !teamLeader.subject) {
      alert("Please fill in all the leader's details.");
      return;
    }

    for (let member of teamMembers) {
      if (!member.fullName || !member.enrollmentNumber || !member.subject) {
        alert("Please fill in all the team members' details.");
        return;
      }
    }

    // ✅ Prepare Data for Backend
    const teamData = { teamLeader, teamSize, teamMembers };
    console.log("Submitting team data:", teamData);

    try {
      const response = await axios.post("http://localhost:5000/api/team/create", teamData);
      alert(`Team Created Successfully! Your Team ID: ${response.data.teamID}`);
      onClose(); // ✅ Close the form after successful creation
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
    }
  };

  return (
    <div className="team-form-container">
      {/* Close Button (❌) */}
      <button className="close-btn" onClick={onClose}>❌</button>

      <div className="team-form">
        <h2>Create a Team</h2>

        {/* Display Freeze Message if Frozen */}
        {isFrozen && <p className="freeze-message">🚫 Team creation is currently frozen by the Coordinator.</p>}

        {/* Team Leader Details */}
        <input type="text" placeholder="Full Name" value={teamLeader.fullName} onChange={(e) => setTeamLeader({ ...teamLeader, fullName: e.target.value })} />
        <input type="text" placeholder="Enrollment Number" value={teamLeader.enrollmentNumber} onChange={(e) => setTeamLeader({ ...teamLeader, enrollmentNumber: e.target.value })} />
        <input type="email" placeholder="Email" value={teamLeader.email} onChange={(e) => setTeamLeader({ ...teamLeader, email: e.target.value })} />
        <input type="text" placeholder="Phone Number" value={teamLeader.phoneNumber} onChange={(e) => setTeamLeader({ ...teamLeader, phoneNumber: e.target.value })} />

        {/* Subject Dropdown */}
        <select value={teamLeader.subject} onChange={(e) => setTeamLeader({ ...teamLeader, subject: e.target.value })}>
          <option value="">Select Subject</option>
          <option value="CS">CS</option>
          <option value="IT">IT</option>
          <option value="AI">AI</option>
        </select>

        <h3>Team Members</h3>
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <input type="text" placeholder="Full Name" value={member.fullName} onChange={(e) => {
              const updatedMembers = [...teamMembers];
              updatedMembers[index].fullName = e.target.value;
              setTeamMembers(updatedMembers);
            }} />

            <input type="text" placeholder="Enrollment Number" value={member.enrollmentNumber} onChange={(e) => {
              const updatedMembers = [...teamMembers];
              updatedMembers[index].enrollmentNumber = e.target.value;
              setTeamMembers(updatedMembers);
            }} />

            {/* Subject Dropdown for Team Members */}
            <select value={member.subject} onChange={(e) => {
              const updatedMembers = [...teamMembers];
              updatedMembers[index].subject = e.target.value;
              setTeamMembers(updatedMembers);
            }}>
              <option value="">Select Subject</option>
              <option value="CS">CS</option>
              <option value="IT">IT</option>
              <option value="AI">AI</option>
            </select>

            {/* Remove Button */}
            {teamMembers.length > 1 && (
              <button className="remove-btn" onClick={() => handleRemoveMember(index)}>Remove</button>
            )}
          </div>
        ))}

        {/* Add Member Button */}
        <button className="add-btn" onClick={handleAddMember} disabled={isFrozen}>Add New Member</button>

        {/* Submit Button - Calls handleSubmit */}
        <button className="submit-btn" onClick={handleSubmit} disabled={isFrozen}>Create Team</button>
      </div>
    </div>
  );
};

export default TeamForm;
