import React, { useEffect, useState } from "react"; // ✅ Correct

import axios from "axios";
import "./AcceptedTeamsSection.css";


const AcceptedTeamsSection = ({ mentor }) => {
  const [acceptedTeamsState, setAcceptedTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  useEffect(() => {
    const fetchAcceptedTeams = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/accepted-requests");
        //Filter teams by mentorId
        const filteredTeams = response.data.filter(
          (team) => team.mentorId === mentor.id
        );
        setAcceptedTeams(filteredTeams);
        //console.log("✅ Accepted Teams Updated:", filteredTeams);
      } catch (error) {
        console.error("❌ Error fetching accepted teams:", error);
      }
    };

    fetchAcceptedTeams();
  }, [mentor.id]); // Update when new teams are accepted
  const handleMeetClick = (team) => {
    setSelectedTeam(team);
    setShowForm(true);
  };

    
    const handleFormCancel = () => {
      setShowForm(false);
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const date = formData.get("date");
    const workDescription = formData.get("workDescription");
    const grade = formData.get("grade");
    const mentorName = formData.get("mentorName");
    const teamMembersPresent = formData.get("teamMembersPresent");
    const memberNames = formData.get("memberNames").split(",").map(name => name.trim());
  
    const meetData = {
      teamId: selectedTeam._id,
      teamName: selectedTeam.teamName,
      mentorName,
      date,
      description: workDescription,
      teamMembersPresent,
      teamMemberNames: memberNames,
      grade
    };
  
   // console.log("📥 Sending Meeting Data:", meetData);
  
    try {
      const response = await axios.post("http://localhost:5000/api/mentormeets", meetData);
  
      if (response.status === 201) {
        console.log("✅ Mentor Meet Successfully Saved:", response.data);
        alert("Meeting Scheduled Successfully!");
      } else {
        console.error("❌ Error scheduling meeting:", response.data);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  
    // Close the form after submission
    setShowForm(false);
  };
  
  return (
    <section className="accepted-section">
      <h2>Accepted Teams</h2>
      <div className="accepted-teams-list">
      {acceptedTeamsState.length === 0 ? (
  <p>No accepted teams yet.</p>
) : (
  acceptedTeamsState.map((team) => (
    <div key={team._id} className="team-card">
      <h4 className= "teamName" >{team.teamName}</h4>
      <p>{team.projectName}</p>
      <p>{team.description}</p>
      <button
        className="meet-button"
        onClick={() => handleMeetClick(team)}
      >
        Meet
      </button>
    </div>
  ))
)}

      </div>

      {/* Pop-up Form */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
  
  
            <h3>Scheduled Meeting for {selectedTeam.teamName}</h3>
            <form onSubmit={handleFormSubmit}>
              {/* Team id */}
              <input type="text" name="teamId" value={selectedTeam._id} disabled/>
              
            {/* Team Name Field */}
            <label>Team Name:</label>
            <input type="text" value={selectedTeam.teamName} disabled />
               {/* Date Field */}
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" name="date" required />
         {/* Mentor Name Field */}
         <label htmlFor="mentorName">Mentor Name:</label>
              <input type="text" id="mentorName" name="mentorName" required />

        {/* Work Description Field */}
        <label htmlFor="workDescription">Work Description:</label>
        <textarea
          id="workDescription"
          name="workDescription"
          required
        ></textarea>
{/* Number of Team Members Present */}
<label htmlFor="teamMembersPresent">No. of Team Members Present:</label>
              <select id="teamMembersPresent" name="teamMembersPresent" required>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>

              {/* Team Members Present Names */}
              <label htmlFor="memberNames">Team Members Present (Names):</label>
              <input type="text" id="memberNames" name="memberNames" placeholder="Enter names separated by commas" required />


        {/* Grade Field */}
        <label htmlFor="grade">Grade:</label>
        <select id="grade" name="grade" required>
          <option value="A">excellent</option>
          <option value="B">very good</option>
          <option value="C">good</option>
          <option value="D">bad</option>
        </select>

        {/* Submit Button */}
        <button type="submit">Submit</button>
        <button type="button" onClick={handleFormCancel}>
                Cancel
              </button>
      </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AcceptedTeamsSection;