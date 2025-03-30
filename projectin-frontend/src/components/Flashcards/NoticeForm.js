import React, { useState } from "react";
import axios from "axios";
import "./NoticeForm.css"; // Styles for popup

const NoticeForm = ({ onClose }) => {
  const [noticeText, setNoticeText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noticeText.trim()) return alert("Please enter a notice");

    try {
      await axios.post("http://localhost:5000/api/notifications/add", { message: noticeText });
      alert("Notice added successfully!");
      setNoticeText("");
      onClose(); // Close the popup after submission
    } catch (error) {
      console.error("Error adding notice:", error);
      alert("Failed to add notice. Try again.");
    }
  };

  return (
    <div className="notice-form-overlay">
      <div className="notice-form">
        <h2>Add Notice</h2>
        <textarea
          rows="4"
          placeholder="Enter notice..."
          value={noticeText}
          onChange={(e) => setNoticeText(e.target.value)}
        />
        <div className="buttons">
          <button className="submit" onClick={handleSubmit}>Submit</button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeForm;
