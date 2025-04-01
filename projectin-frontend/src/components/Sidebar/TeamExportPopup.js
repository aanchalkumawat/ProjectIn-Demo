import React from "react";
import "./TeamExportPopup.css";

const TeamExportPopup = ({ onClose }) => {
  const handleExportExcel = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/export-team-details", {
        method: "GET",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "TeamDetails.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert("Excel downloaded successfully!");
      } else {
        alert("Failed to export team details.");
      }
    } catch (error) {
      console.error("Export Error:", error);
    }
  };

  return (
    <div className="epopup-overlay">
      <div className="epopup-content">
         <h3 className="exportdetails">Download the Team Details</h3> 
        <button className="export-button" onClick={handleExportExcel}>
          Export as Excel
        </button>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TeamExportPopup;
