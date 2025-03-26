import React, { useState } from "react";
import axios from "axios";

const ImportMentorDataPopup = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(""); // ✅ Store upload success/error message

  // ✅ Handle File Selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;
    if (!file.name.endsWith(".xlsx")) {
      alert("❌ Please upload a valid Excel file (.xlsx)");
      return;
    }

    setSelectedFile(file);
    setUploadMessage(""); // Clear previous messages
  };

  // ✅ Handle File Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("⚠️ No file selected. Please choose an Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      setUploadMessage(""); // Clear previous messages

      const response = await axios.post(
        "http://localhost:5000/api/mentors/import", // ✅ Mentor API Endpoint
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );        

      // ✅ Display import results
      setUploadMessage(`✅ ${response.data.message}`);
      setSelectedFile(null);
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      setUploadMessage("❌ Failed to upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>📂 Import Mentor Data</h2>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        {selectedFile && <p>📄 Selected File: {selectedFile.name}</p>}

        {/* ✅ Display success or error message */}
        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}

        <div className="popup-buttons">
          <button className="upload" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "📤 Upload"}
          </button>
          <button className="close" onClick={onClose} disabled={isUploading}>
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportMentorDataPopup;
