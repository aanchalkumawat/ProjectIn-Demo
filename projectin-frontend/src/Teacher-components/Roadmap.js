import React, { useState } from "react";
import {
  FaUsers, FaUserTie, FaClipboardList, FaBook, FaLaptopCode,
  FaCheckCircle, FaFileAlt, FaTrash, FaUniversity, FaFlagCheckered
} from "react-icons/fa";
import "./Roadmap.css";

const roadmapSteps = [
  { label: "Team Formation", icon: <FaUsers />, description: "Form a team with your peers and register." },
  { label: "Mentor Allocation", icon: <FaUserTie />, description: "Get a mentor assigned to guide you through the project." },
  { label: "Project Detail Submission", icon: <FaClipboardList />, description: "Submit the details of your project including scope, objectives, and technology stack." },
  { label: "SRS & SDS Presentation", icon: <FaBook />, description: "Present the Software Requirement Specification (SRS) and System Design Specification (SDS) to the committee." },
  { label: "Project Labs", icon: <FaLaptopCode />, description: "Start working on your project in the designated lab sessions." },
  { label: "Internal Assessment", icon: <FaCheckCircle />, description: "First evaluation by faculty based on progress and implementation." },
  { label: "2nd Internal Assessment", icon: <FaCheckCircle />, description: "Midway evaluation to check improvements and feedback implementation." },
  { label: "Final Internal Assessment", icon: <FaCheckCircle />, description: "Final internal review before submission." },
  { label: "Report Submission", icon: <FaFileAlt />, description: "Submit the final report documenting your project." },
  { label: "Project Dumping", icon: <FaTrash />, description: "Archive your project for future reference or improvements." },
  { label: "External Evaluation", icon: <FaUniversity />, description: "Final evaluation by external examiners or industry professionals." },
  { label: "Finish", icon: <FaFlagCheckered />, description: "Congratulations! You have successfully completed the project." }
];

const Roadmap = () => {
  const [flippedCards, setFlippedCards] = useState(Array(roadmapSteps.length).fill(false));

  const handleFlip = (index) => {
    const updatedFlips = [...flippedCards];
    updatedFlips[index] = !updatedFlips[index];
    setFlippedCards(updatedFlips);
  };

  return (
    <div className="roadmap-container">
      <h1 className="roadmap-title"> Project Roadmap</h1>

      <div className="roadmap-grid">
        {roadmapSteps.map((step, index) => (
          <div
            key={index}
            className={`roadmap-card ${flippedCards[index] ? "flipped" : ""}`}
            onClick={() => handleFlip(index)}
          >
            {/* Front Side */}
            <div className="roadmap-card-front">
              <div className="roadmap-step-number">{index + 1}</div>
              <div className="roadmap-icon">{step.icon}</div>
              <div className="roadmap-label">{step.label}</div>
            </div>

            {/* Back Side */}
            <div className="roadmap-card-back">
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
