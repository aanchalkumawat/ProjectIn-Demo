
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EvaluationPanel.css";
import Sidebar from "./Sidebar"
import Header from "./Header"
const EvaluationPanel = () => {
  const [teams, setTeams] = useState([]);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [evaluations, setEvaluations] = useState({});
  const [isEvaluation1Submitted, setIsEvaluation1Submitted] = useState(false);

  useEffect(() => {
    const fetchAssignedTeams = async () => {
      try {
        const token = localStorage.getItem("token"); 
        console.log("Token from localStorage:", token);
        if (!token) {
          console.error("No token found, please log in again.");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/evaluation", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Assigned Teams Response:", response.data);
        setTeams(response.data.teams || []);
      } catch (error) {
        console.error("Error fetching assigned teams:", error);
      }
    };

    fetchAssignedTeams();
  }, []);

  const handleEvaluateClick = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  const handleEvaluationChange = (teamId, rollNo, evaluationNumber, value) => {
    setEvaluations((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [rollNo]: {
          ...prev[teamId]?.[rollNo],
          [evaluationNumber]: value,
        },
      },
    }));
  };

  const handleEvaluation1Submit = async (teamId, rollNo) => {
    const marks2 = evaluations[teamId]?.[rollNo]?.evaluation1;
    if (!marks2) {
      alert("Please enter marks for Evaluation 1.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/marks/submit-eval1",
        { rollNo, teamId, evalMarks1: parseInt(marks2, 10) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.message);
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting Evaluation 1:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to submit Evaluation 1.");
    }
  };
  

  const handleEvaluation2Submit = async (teamId, rollNo) => {
    const marks2 = evaluations[teamId]?.[rollNo]?.evaluation2;
    if (!marks2) {
      alert("Please enter marks for Evaluation 2.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/marks/submit-eval2",
        { rollNo, teamId, evalMarks2: parseInt(marks2, 10) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.message);
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting Evaluation 2:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to submit Evaluation 2.");
    }
  };
  return (
    <><Header></Header><Sidebar></Sidebar>
    <div className="evaluation-panel">
      <h2 className="heading">Assigned Teams</h2>
      <div className="team-list">
        {Array.isArray(teams) && teams.length > 0 ? (
          teams.map((team) => (
            <div key={team._id} className="team-bar">
              <div className="team-info">
                <strong>Team ID: {team.teamID}</strong>
              </div>
              <button
                className="evaluate-btn"
                onClick={() => handleEvaluateClick(team._id)}
              >
                {expandedTeam === team._id ? "Close" : "Evaluate"}
              </button>

              {expandedTeam === team._id && (
                <div className="evaluation-section">
                  <table className="evaluation-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Evaluation 1</th>
                        <th>Submit</th>
                        <th>Evaluation 2</th>
                        <th>Submit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.teamMembers.map((member) => (
                        <tr key={member.enrollmentNumber}>
                          <td>{member.enrollmentNumber}</td>
                          <td>
                            <input
                              type="number"
                              placeholder="Marks"
                              value={
                                evaluations[team._id]?.[member.enrollmentNumber]
                                  ?.evaluation1 || ""
                              }
                              onChange={(e) =>
                                handleEvaluationChange(
                                  team._id,
                                  member.enrollmentNumber,
                                  "evaluation1",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <button
                              className="submit-btn"
                              onClick={() =>
                                handleEvaluation1Submit(
                                  team._id,
                                  member.enrollmentNumber
                                )
                              }
                              disabled={
                                !evaluations[team._id]?.[
                                  member.enrollmentNumber
                                ]?.evaluation1
                              }
                            >
                              Submit
                            </button>
                          </td>
                          <td>
                            <input
                              type="number"
                              placeholder="Marks"
                              value={
                                evaluations[team._id]?.[member.enrollmentNumber]
                                  ?.evaluation2 || ""
                              }
                              onChange={(e) =>
                                handleEvaluationChange(
                                  team._id,
                                  member.enrollmentNumber,
                                  "evaluation2",
                                  e.target.value
                                )
                              }
                              disabled={
                                !evaluations[team._id]?.[
                                  member.enrollmentNumber
                                ]?.evaluation1
                              }
                            />
                          </td>
                          <td>
                            <button
                              className="submit-btn"
                              onClick={() =>
                                handleEvaluation2Submit(
                                  team._id,
                                  member.enrollmentNumber
                                )
                              }
                              disabled={
                                !evaluations[team._id]?.[
                                  member.enrollmentNumber
                                ]?.evaluation2
                              }
                            >
                              Submit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-teams">No assigned teams available.</p>
        )}
      </div>
    </div></>
  );
};

export default EvaluationPanel;
