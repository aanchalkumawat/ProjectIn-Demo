import React, { useState, useEffect } from "react";
import "./FreezeTeamModal.css";

const FreezeTeamModal = ({ onClose }) => {
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalStudentsWhoFormedTeams: 0,
    totalStudents: 0,
  });

  const [isFrozen, setIsFrozen] = useState(false);
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
            fetchFreezeStatus();
            setIsFrozen(true); 
            console.log(isFrozen);
            onClose();
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error freezing teams:", error);
    }
};
const handleRemoveFreeze = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/team-freeze/remove-freeze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (response.ok) {
      alert("Freeze has been removed successfully!");
      fetchFreezeStatus();
      setIsFrozen(false); // ✅ Enable "Freeze Team" button & disable "Remove Freeze"
    } else {
      alert("Error: " + data.error);
    }
  } catch (error) {
    console.error("Error removing freeze:", error);
  }
};

const fetchFreezeStatus = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/team-freeze/freeze-status");
    const data = await response.json();
    console.log("Fetched Freeze Status:", data.isFrozen); // ✅ Debugging
    setIsFrozen(data.isFrozen);
  } catch (error) {
    console.error("Error fetching freeze status:", error);
  }
};
useEffect(() => {
  fetchFreezeStatus();
}, []);

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
           {/* ✅ Freeze Button (Disabled if already frozen) */}
           <button className="freeze-btn" onClick={handleFreezeClick} disabled={isFrozen}>
            Freeze Team
          </button>

          {/* ✅ Remove Freeze Button (Disabled if not frozen yet) */}
          <button className="remove-freeze-btn" onClick={handleRemoveFreeze} disabled={!isFrozen}>
            Remove Freeze
          </button>
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