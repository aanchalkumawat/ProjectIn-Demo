import React, { useState, useEffect } from "react";
import axios from "axios";
import TeamForm from "./TeamForm";
import MentorForm from "./MentorForm";

const StudentDashboard = () => {
  const [showForm, setShowForm] = useState(false); // Toggle Team Form visibility
  const [invitations, setInvitations] = useState([]); // Track pending invitations
  const [notifications, setNotifications] = useState([]); // Track notifications
  const [isMentorFormOpen, setIsMentorFormOpen] = useState(false);
  // Fetch invitations and notifications on component mount
  useEffect(() => {
    const fetchInvitationsAndNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch pending invitations
        const invitationsRes = await axios.get(
          "http://localhost:5000/api/team/invitations",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInvitations(invitationsRes.data.invitations);

        // Fetch notifications
        const notificationsRes = await axios.get(
          "http://localhost:5000/api/team/notifications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(notificationsRes.data.notifications);
      } catch (error) {
        console.error("Error fetching invitations or notifications:", error);
        alert("Failed to fetch data. Please try again.");
      }
    };

    fetchInvitationsAndNotifications();
  }, []);

  // Handle response to an invitation (accept or reject)
  const respondToInvitation = async (notificationId, response) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/team/respond",
        { notificationId, response },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);

      // Update invitations list after response
      setInvitations((prev) =>
        prev.filter((invitation) => invitation.notificationId !== notificationId)
      );

      // Remove the corresponding notification
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error("Error responding to invitation:", error);
      alert("Failed to respond to invitation.");
    }
  };

  return (
    <div>
      <h2>Welcome to the Student Dashboard</h2>

      {/* Toggle Team Form */}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Team Form" : "Open Team Form"}
      </button>
      {showForm && <TeamForm />}

      {/* Pending Invitations */}
      <div>
        <h3>Pending Invitations</h3>
        {invitations.length > 0 ? (
          <ul>
            {invitations.map((invitation) => (
              <li key={invitation.notificationId}>
                {`You have been invited to join team "${invitation.teamName}"`}
                <button onClick={() => respondToInvitation(invitation.notificationId, "accepted")}>
                  Accept
                </button>
                <button onClick={() => respondToInvitation(invitation.notificationId, "rejected")}>
                  Reject
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending invitations.</p>
        )}
      </div>

      {/* Notifications */}
      <div>
        <h3>Notifications</h3>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification._id}>
                {notification.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications.</p>
        )}
      </div>
      <div>
      <h2>Welcome to the Student Dashboard</h2>
      <button onClick={() => setIsMentorFormOpen(true)}>Mentor Selection</button>
      <MentorForm isOpen={isMentorFormOpen} onClose={() => setIsMentorFormOpen(false)} />
    </div>
    </div>
  );
};

export default StudentDashboard;
