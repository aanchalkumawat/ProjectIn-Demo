import React, { useState } from "react";
import "./NoticeFlashcard.css"; // We'll add styles separately

const NoticeFlashcard = ({ onOpen }) => {
  return (
    <div className="notice-flashcard" onClick={onOpen}>
      <h3>📢 Add Notice</h3>
      <p>Click to add a new notice</p>
    </div>
  );
};

export default NoticeFlashcard;
