import React from "react";
import "./FlushDataPopup.css";

const FlushDataPopup = ({ onClose }) => {
  const handleFlushAll = async () => {
    if (window.confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      try {
        const response = await fetch("http://localhost:5000/api/flush-all", {
          method: "DELETE",
        });

        const data = await response.json();
        alert(data.message);
        onClose(); // Close the popup after deletion
      } catch (error) {
        console.error("Error flushing data:", error);
        alert("Failed to delete data.");
      }
    }
  };

  return (
    <div className="fpopup-overlay">
      <div className="fpopup-content">
        <h3 className="flushdetails">
          Are you sure you want to delete all data for this session?
        </h3>
        <button className="delete-button" onClick={handleFlushAll}>
          Delete
        </button>
        <button className="fclose-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FlushDataPopup;
