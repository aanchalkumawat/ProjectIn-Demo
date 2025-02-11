import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './TeamFormationForm.css';

const TeamFormationForm = () => {
  const [email, setEmail] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [teamId, setTeamId] = useState(null); // Store team ID

  // ✅ Fetch the team details on load
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/team/details', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.team) {
          setTeamId(res.data.team._id);
          setInvitations(res.data.team.pendingInvitations || []);
        }
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    };

    fetchTeamDetails();
  }, []);

  // ✅ Send invitation to a new member
  const handleSendInvite = async () => {
    if (email.trim() === '') return;
    
    /*if (!teamId) {
      alert('No team found. Please create a team first.');
      return;
    }*/
    if (invitations.some((inv) => inv.email === email)) {
      alert('This email has already been invited.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/team/invite',
        { teamId, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setInvitations([...invitations, { email, status: 'Pending' }]);
      setEmail('');
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Check if the user exists.');
    }
  };

  // ✅ Remove a rejected invitation
  const handleRemoveRejected = (index) => {
    const updatedInvitations = invitations.filter((_, idx) => idx !== index);
    setInvitations(updatedInvitations);
  };

  const acceptedCount = invitations.filter((inv) => inv.status === 'Accepted').length;

  return (
    <div className='container'>
      <div className='form-container'>
        <div className='form'> 
          <label>Student Name:</label>
          <input type='text' placeholder='Enter your correct name' required /><br />
          <label>Rollno:</label>
          <input type='text' placeholder='Enter your correct rollno' required /><br />
          <label>Course:</label>
          <select id="course" required>
            <option defaultValue="" disabled>--not selected--</option>
            <option value="cs">CS</option>
            <option value="it">IT</option>
            <option value="cs-ai">CS-AI</option>
          </select>
          <br />
          <label>Banasthali Email Id:</label>
          <input type='email' placeholder='Enter your banasthali email' required /><br />
          
          <label>Send invite:</label>
          <input 
            type='email' 
            placeholder='Enter the Banasthali email of the student' required
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <button onClick={handleSendInvite}>Send Invite</button><br />

          {/* ✅ Display Invitation List */}
          <div className='invitation-list'>
            {invitations.map((invitation, index) => (
              <div key={index} className='invitation-item'>
                <span>{invitation.email}</span>
                <span className={`status ${invitation.status.toLowerCase()}`}>
                  {invitation.status}
                </span>
                {invitation.status === 'Rejected' && (
                  <button 
                    className='remove-btn' 
                    onClick={() => handleRemoveRejected(index)}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ✅ Show accepted members count */}
          <p className='member-count'>
            Accepted Members: {acceptedCount} / 5
          </p>
          {acceptedCount >= 5 && (
            <p className='error'>Maximum team members reached. No more members can be accepted.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamFormationForm;
