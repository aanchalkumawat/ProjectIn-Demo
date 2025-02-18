import React, { useState, useEffect } from "react";
import axios from "axios";
import TeamForm from "./TeamFormationForm";
import MentorForm from "./MentorForm";
import ProjectDetailForm from "./ProjectDetailForm";
import Submission1 from "./submission1";
import Submission2 from "./submission2"; 

const StudentDashboard = () => {
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showSubmission1, setShowSubmission1] = useState(false);
  const [showSubmission2, setShowSubmission2] = useState(false); // ✅ Added state for Submission2 form
  const [invitations, setInvitations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // ✅ Fetch invitations & notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const invitationsRes = await axios.get(
          "http://localhost:5000/api/team/invitations",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInvitations(invitationsRes.data.invitations);

        const notificationsRes = await axios.get(
          "http://localhost:5000/api/team/notifications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(notificationsRes.data.notifications);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, []);

  // ✅ Handle invitation response
  const respondToInvitation = async (notificationId, response) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/team/respond",
        { notificationId, response },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);

      setInvitations((prev) =>
        prev.filter((inv) => inv.notificationId !== notificationId)
      );

      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
    } catch (error) {
      console.error("Error responding to invitation:", error);
      alert("Failed to respond to invitation.");
    }
  };

  // ✅ Handle Project Detail Form Submission
  const handleProjectSubmit = async (projectData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("🚨 Authentication failed. Please log in.");
        return;
      }

      console.log("🔍 Sending project data:", projectData);

      const res = await axios.post(
        "http://localhost:5000/api/project/submit",
        projectData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      alert(res.data.message);
    } catch (error) {
      console.error("❌ Error submitting project:", error);
      alert(error.response?.data?.message || "Failed to submit project.");
    }
  };

  return (
    <div>
      <h2>Welcome to the Student Dashboard</h2>

      {/* ✅ Team Formation */}
      <button onClick={() => setShowTeamForm(!showTeamForm)}>
        {showTeamForm ? "Close Team Form" : "Open Team Form"}
      </button>
      {showTeamForm && <TeamForm />}

      {/* ✅ Mentor Selection */}
      <button onClick={() => setShowMentorForm(true)}>Mentor Selection</button>
      {showMentorForm && <MentorForm isOpen={showMentorForm} onClose={() => setShowMentorForm(false)} />}

      {/* ✅ Project Details Submission */}
      <button onClick={() => setShowProjectForm(true)}>Submit Project Details</button>
      {showProjectForm && (
        <ProjectDetailForm 
          onClose={() => setShowProjectForm(false)} 
          onSubmit={handleProjectSubmit} 
        />
      )}

      {/* ✅ Submission1 Form Button */}
      <button onClick={() => setShowSubmission1(true)}>Submit SRS / SDS / Synopsis</button>
      {showSubmission1 && <Submission1 closeModal={() => setShowSubmission1(false)} />}

      {/* ✅ Submission2 Form Button */}
      <button onClick={() => setShowSubmission2(true)}>Submit Project Report</button>
      {showSubmission2 && <Submission2 closeModal={() => setShowSubmission2(false)} />} {/* ✅ Submission2 added */}

      {/* ✅ Pending Invitations */}
      <div>
        <h3>Pending Invitations</h3>
        {invitations.length > 0 ? (
          <ul>
            {invitations.map((inv) => (
              <li key={inv.notificationId}>
                {`You have been invited to join team "${inv.teamName}"`}
                <button onClick={() => respondToInvitation(inv.notificationId, "accepted")}>
                  Accept
                </button>
                <button onClick={() => respondToInvitation(inv.notificationId, "rejected")}>
                  Reject
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending invitations.</p>
        )}
      </div>

      {/* ✅ Notifications */}
      <div>
        <h3>Notifications</h3>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notif) => (
              <li key={notif._id}>
                {notif.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
