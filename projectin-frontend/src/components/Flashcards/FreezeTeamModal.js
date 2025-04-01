import React, { useState, useEffect } from "react";
import "./FreezeTeamModal.css";

const FreezeTeamModal = ({ onClose }) => {
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalStudentsWhoFormedTeams: 0,
    totalStudents: 0,
  });

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch team statistics from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/team/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching team stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleFreezeClick = () => {
    if (stats.totalStudents === stats.totalStudentsWhoFormedTeams) {
      setMessage(
        "Freeze Team Details\nAre you sure you want to freeze the team details? No further changes can be made by the students after this."
      );
    } else {
      setMessage(
        "All students have not formed the team.\nAre you sure you want to freeze the team details?"
      );
    }
    setIsConfirmDialogOpen(true);
  };

  const confirmFreeze = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/team-freeze/freeze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (response.ok) {
            alert("Teams have been frozen successfully!");
            onClose();
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error freezing teams:", error);
    }
};


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Team Formation Status</h2>
        <p>
          <strong>Total Teams Formed:</strong> {stats.totalTeams}
        </p>
        <p>
          <strong>Total Students Who Formed Teams:</strong> {stats.totalStudentsWhoFormedTeams}
        </p>
        <p>
          <strong>Total Students:</strong> {stats.totalStudents}
        </p>

        <div className="modal-actions">
          <button className="fclose-btn" onClick={onClose}>Close</button>
          <button className="freeze-btn" onClick={handleFreezeClick}>Freeze Team</button>
        </div>
      </div>

      {isConfirmDialogOpen && (
        <div className="confirm-dialog">
          <div className="confirm-content">
            <p>{message}</p>
            <div className="confirm-actions">
              <button className="fcancel-btn" onClick={() => setIsConfirmDialogOpen(false)}>
                Cancel
              </button>
              <button className="fconfirm-btn" onClick={confirmFreeze}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreezeTeamModal;