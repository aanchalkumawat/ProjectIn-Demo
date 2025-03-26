import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Remarks from "./Remarks";
import "./Marks.css";

const Marks = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [marksTableVisible, setMarksTableVisible] = useState(null);
  const [remarksVisible, setRemarksVisible] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [marks, setMarks] = useState({});
  const [remarks, setRemarks] = useState({});
  const [submittedTeams, setSubmittedTeams] = useState({});

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/team/getTeams");
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  const fetchRemarks = async (teamId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/remarks/${encodeURIComponent(teamId)}`);
      const data = await response.json();
      if (!response.ok) {
        console.error("No remarks found:", data.message);
        return;
      }
      setRemarks((prev) => ({
        ...prev,
        [teamId]: data.remarksHistory || [],
      }));
    } catch (error) {
      console.error("Error fetching remarks:", error);
    }
  };

  const toggleRemarks = (teamId) => {
    if (remarksVisible === teamId) {
      setRemarksVisible(null);
    } else {
      fetchRemarks(teamId);
      setRemarksVisible(teamId);
    }
  };

  const toggleMarksTable = (teamId) => {
    setMarksTableVisible(marksTableVisible === teamId ? null : teamId);
    if (!marks[teamId]) {
      setMarks((prev) => ({
        ...prev,
        [teamId]: {},
      }));
    }
  };

  const handleSubmitMarks = async (teamId) => {
    const team = teams.find((t) => t.teamID === teamId);
    if (!team || !marks[teamId]) return;

    try {
      const allStudents = [team.teamLeader, ...team.teamMembers];
      const studentsToSubmit = allStudents.map((student) => ({
        enrollmentNumber: student.enrollmentNumber,
        fullName: student.fullName,
        marks: marks[teamId][student.enrollmentNumber],
      }));

      const response = await fetch("http://localhost:5000/api/marks/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamID: teamId,
          students: studentsToSubmit,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Error submitting marks:", data.message);
        return;
      }

      setSubmittedTeams((prev) => ({ ...prev, [teamId]: true }));
      alert("Marks submitted successfully!");
    } catch (error) {
      console.error("Error submitting marks:", error);
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.teamID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="marks-page">
      <div className="search-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <input
          type="text"
          className="search-bar"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flashcards">
        {filteredTeams.map((team) => (
          <div key={team.teamID} className="flashcard">
            <div className="flashcard-header">
              <h3>{team.teamID}</h3>
              <div className="button-group">
                <button
                  className="action-button"
                  onClick={() => toggleMarksTable(team.teamID)}
                >
                  Assign Marks
                </button>
                <button
                  className="action-button"
                  onClick={() => toggleRemarks(team.teamID)}
                >
                  View Remarks
                </button>
              </div>
            </div>

            {marksTableVisible === team.teamID && (
              <div className="marks-table">
                <h4>Assign Marks</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Enrollment Number</th>
                      <th>Name</th>
                      <th>Marks Obtained(out of 100)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[team.teamLeader, ...team.teamMembers].map((member) => (
                      <tr key={member.enrollmentNumber}>
                        <td>{member.enrollmentNumber}</td>
                        <td>{
                          member.enrollmentNumber === team.teamLeader.enrollmentNumber
                            ? `${member.fullName} (Leader)`
                            : member.fullName
                        }</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Enter Marks"
                            value={marks[team.teamID]?.[member.enrollmentNumber] || ""}
                            onChange={(e) =>
                              setMarks((prev) => ({
                                ...prev,
                                [team.teamID]: {
                                  ...prev[team.teamID],
                                  [member.enrollmentNumber]: e.target.value,
                                },
                              }))
                            }
                            disabled={submittedTeams[team.teamID]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  className="submit-button"
                  onClick={() => handleSubmitMarks(team.teamID)}
                  disabled={submittedTeams[team.teamID] || ![team.teamLeader, ...team.teamMembers].every(member => marks[team.teamID]?.[member.enrollmentNumber])}
                >
                  {submittedTeams[team.teamID] ? "Marks Submitted" : "Submit Marks"}
                </button>
              </div>
            )}

            {remarksVisible === team.teamID && <Remarks remarks={remarks[team.teamID]} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marks;