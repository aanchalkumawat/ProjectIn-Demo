import React, { useState } from 'react';

const TeamFormationForm = () => {
  const [name, setName] = useState('');
  const [rollno, setRollno] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [teamId, setTeamId] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitations, setInvitations] = useState([]);

  // Create a team
  const handleCreateTeam = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/team/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rollno, email, course })
      });

      if (!response.ok) throw new Error('Failed to create team');

      const data = await response.json();
      setTeamId(data.team._id);
      alert('Team created successfully!');
    } catch (error) {
      console.error('Error creating team:', error);
      alert(error.message);
    }
  };

  // Send an invite
  const handleSendInvite = async () => {
    if (!inviteEmail.trim() || !teamId) {
      alert('Enter a valid email and ensure the team is created.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/team/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, email: inviteEmail })
      });

      if (!response.ok) throw new Error('Failed to send invite');

      const data = await response.json();
      setInvitations(data.invitations);
      setInviteEmail('');
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Error sending invite:', error);
      alert(error.message);
    }
  };

  // Accept or Reject an invite
  const updateInvitationStatus = async (email, status) => {
    try {
      const response = await fetch('http://localhost:5000/api/team/update-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, email, status })
      });

      if (!response.ok) throw new Error('Failed to update invitation status');

      const data = await response.json();
      setInvitations(data.invitations);
      alert(`Invitation ${status.toLowerCase()}!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0px 0px 10px #ddd' }}>
      <h2>Team Formation</h2>

      {!teamId ? (
        <>
          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: '10px', padding: '8px', width: '80%' }} /><br />
          <input type="text" placeholder="Roll Number" value={rollno} onChange={(e) => setRollno(e.target.value)} style={{ marginBottom: '10px', padding: '8px', width: '80%' }} /><br />
          <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: '10px', padding: '8px', width: '80%' }} /><br />
          <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} style={{ marginBottom: '10px', padding: '8px', width: '80%' }} /><br />
          <button onClick={handleCreateTeam} style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Create Team</button>
        </>
      ) : (
        <>
          <h3>Team ID: {teamId}</h3>
          <input type="email" placeholder="Invite Email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} style={{ marginBottom: '10px', padding: '8px', width: '80%' }} />
          <button onClick={handleSendInvite} style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Send Invite</button>

          <h3>Invitations</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {invitations.map((invite, index) => (
              <li key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                {invite.email} - {invite.status}
                {invite.status === 'Pending' && (
                  <>
                    <button onClick={() => updateInvitationStatus(invite.email, 'Accepted')} style={{ marginLeft: '10px', padding: '5px 10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Accept</button>
                    <button onClick={() => updateInvitationStatus(invite.email, 'Rejected')} style={{ marginLeft: '10px', padding: '5px 10px', background: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Reject</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TeamFormationForm;

