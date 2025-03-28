import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MentorForm.css";

const MentorForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    isResearchBased: false,
    projectDescription: "",
    technologyDetails: "",
    members: [{ name: "", rollno: "", phone: "" }],
    mentorName: "",
  });

  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchMentors = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get("http://localhost:5000/api/mentor/mentors", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMentors(res.data.mentors);
        } catch (error) {
          console.error("Error fetching mentors:", error);
          alert("Failed to load mentors.");
        }
      };

      fetchMentors();
    }
  }, [isOpen]); // Fetch mentors only when modal opens

  const addMember = () => {
    if (formData.members.length < 5) {
      setFormData({
        ...formData,
        members: [...formData.members, { name: "", rollno: "" }],
      });
    } else {
      alert("You can only add up to 5 members.");
    }
  };

  const removeMember = (index) => {
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index][field] = value;
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isResearchBased: e.target.id === "yes" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/mentor/request", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      onClose();
    } catch (error) {
      console.error("Error submitting mentor request:", error.response?.data || error.message);
      alert("Failed to submit mentor request.");
    }
  };

  return (
    <div className={`mentor-modal-overlay ${isOpen ? "open" : "closed"}`}>
      <div className="mentor-modal-container">
        <h1>Mentor Request Form</h1>
        <br></br>
        <button className="mentor-close-button" onClick={onClose}>
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          <label>Project Name:</label>
          <input
            type="text"
            name="projectName"
            placeholder="Enter your project name"
            value={formData.projectName}
            onChange={handleChange}
            required
          />

          <label>Is your project Research based?</label>
          <div>
            <label htmlFor="yes">Yes</label>
            <input type="radio" id="yes" checked={formData.isResearchBased} onChange={handleCheckboxChange} />
            <label htmlFor="no">No</label>
            <input type="radio" id="no" checked={!formData.isResearchBased} onChange={handleCheckboxChange} />
          </div>

          <label>Project Description:</label>
          <textarea
            name="projectDescription"
            placeholder="Enter project description"
            value={formData.projectDescription}
            onChange={handleChange}
            required
          ></textarea>

          <label>Detail of technology you will be using:</label>
          <textarea
            name="technologyDetails"
            placeholder="Enter technology details"
            value={formData.technologyDetails}
            onChange={handleChange}
            required
          ></textarea>

          <label>Member Details:</label>
          {formData.members.map((member, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={index === 0 ? "Leader Name" : "Member Name"}
                value={member.name}
                onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Roll Number"
                value={member.rollno}
                onChange={(e) => handleMemberChange(index, "rollno", e.target.value)}
                required
              />
              {index > 0 && (
                <button type="button" onClick={() => removeMember(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addMember}>
            Add Member
          </button>

          <label>Mentor Name:</label>
          <select name="mentorName" value={formData.mentorName} onChange={handleChange} required>
            <option value="" disabled>
              Select your mentor
            </option>
            {mentors.map((mentor) => (
              <option key={mentor._id} value={mentor.name}>
                {mentor.name} ({mentor.expertise})
              </option>
            ))}
          </select>

          <button type="submit">Send Request</button>
        </form>
      </div>
    </div>
  );
};

export default MentorForm;