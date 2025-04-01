import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Flashcards.css";
import SetLimitsModal from "./SetLimitsModal";
import FreezeTeamModal from "./FreezeTeamModal";
import EvaluateModal from "./EvaluateModal";

const Flashcards = () => {
  const navigate = useNavigate();
  const [isSetLimitsOpen, setIsSetLimitsOpen] = useState(false);
  const [isFreezePopupOpen, setIsFreezePopupOpen] = useState(false);
  const [isEvaluatePopupOpen, setIsEvaluatePopupOpen] = useState(false);

  // Mock Data (Replace with Real Data from Backend)
  const totalTeams = 10;
  const totalStudents = 50;
  const studentsWhoFormedTeams = 50;

  return (
    <>
      <div className="flashcards-container">
        <div className="fflashcard" onClick={() => setIsSetLimitsOpen(true)}>
          <h3 className="flashcardheader">Set Team and Mentor Limit</h3>
          <p>Configure the maximum number of team members and mentors per team.</p>
        </div>

        <div className="fflashcard" onClick={() => setIsFreezePopupOpen(true)}>
          <h3 className="flashcardheader">Freeze Team</h3>
          <p>Lock the team configurations to finalize the setup.</p>
        </div>
      </div>

      <div className="flashcards-container">
        <div className="fflashcard" onClick={() => navigate("/coordinator-dashboard/panel-formation")}>
          <h3 className="flashcardheader">Panel Formation</h3>
          <p>Create panels for evaluating student projects and assign members to each panel.</p>
        </div>

        <div className="fflashcard" onClick={() => setIsEvaluatePopupOpen(true)}>
          <h3 className="flashcardheader">Evaluate</h3>
          <p>Provide remarks and evaluate submissions from students.</p>
        </div>
      </div>

      {isSetLimitsOpen && <SetLimitsModal isOpen={isSetLimitsOpen} onClose={() => setIsSetLimitsOpen(false)} />}
      {isFreezePopupOpen && (
        <FreezeTeamModal
          totalTeams={totalTeams}
          totalStudents={totalStudents}
          studentsWhoFormedTeams={studentsWhoFormedTeams}
          onClose={() => setIsFreezePopupOpen(false)}
        />
      )}
      {isEvaluatePopupOpen && <EvaluateModal onClose={() => setIsEvaluatePopupOpen(false)} onSubmit={(data) => console.log("Evaluation Submitted:", data)} />}
    </>
  );
};

export default Flashcards;