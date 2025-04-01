import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./PanelFormation.css";

const PanelFormation = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [finalizedTeachers, setFinalizedTeachers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [panels, setPanels] = useState([]);
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [showAllotPopup, setShowAllotPopup] = useState(false);
  const [unallottedTeams, setUnallottedTeams] = useState([]);
  const [panelTeams, setPanelTeams] = useState({});
  const [coordinatorId, setCoordinatorId] = useState(null);
  const [teams, setTeams] = useState([]);
  const panelsRef = useRef(null);

  // ✅ Fetch Coordinator ID
  useEffect(() => {
    const fetchCoordinatorId = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/panel/coordinator");
        const data = await response.json();
        setCoordinatorId(data.coordinatorId);
      } catch (error) {
        console.error("Error fetching coordinator ID:", error);
      }
    };
    fetchCoordinatorId();
  }, []);

  // ✅ Fetch Teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/panel/teachers");
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  // ✅ Fetch Unallotted Teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/panel/unallotted-teams");
        const data = await response.json();
        if (Array.isArray(data)) {
          setUnallottedTeams(data);
        } else {
          setUnallottedTeams([]);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
        setUnallottedTeams([]);
      }
    };
    fetchTeams();
  }, []);

  // ✅ Fetch Panels from Backend
  useEffect(() => {
    const fetchPanels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/panel/panels");
        const data = await response.json();
        setPanels(data);
      } catch (error) {
        console.error("Error fetching panels:", error);
      }
    };
    fetchPanels();
  }, []);

  useEffect(() => {
    const fetchUnallottedTeams = async () => {
      try {
        console.log("🔍 Fetching unallotted teams from frontend...");
        const response = await fetch("http://localhost:5000/api/panels/unallotted-teams");
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch teams");
        }
  
        console.log("✅ Unallotted Teams Received:", data);
        setTeams(data);  // Ensure this updates state properly
      } catch (error) {
        console.error("❌ Error fetching unallotted teams:", error);
      }
    };
  
    fetchUnallottedTeams();
  }, []);  // ✅ Runs only once on mount
  

  const toggleSelection = (teacher) => {
    if (finalizedTeachers.has(teacher._id)) return;
    setSelectedTeachers((prevSelected) =>
      prevSelected.some((t) => t._id === teacher._id)
        ? prevSelected.filter((t) => t._id !== teacher._id)
        : [...prevSelected, teacher]
    );
  };

  const formPanel = async () => {
    if (selectedTeachers.length === 0) {
      alert("Please select at least one teacher.");
      return;
    }
    const teacherIds = selectedTeachers.map(teacher => teacher._id);
    try {
      const response = await fetch("http://localhost:5000/api/panel/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherIds })
      });
      if (response.ok) {
        alert("Panel created successfully!");
        setPanels([]);
        setFinalizedTeachers(new Set([...finalizedTeachers, ...teacherIds]));
        setTeachers(teachers.filter((teacher) => !teacherIds.includes(teacher._id)));
        setSelectedTeachers([]);
      } else {
        console.error("Error creating panel.");
      }
    } catch (error) {
      console.error("Error creating panel:", error);
    }
  };

  const handleCheckboxChange = (teamId) => {
    setPanelTeams((prev) => {
      const selectedTeams = prev[expandedPanel] || [];
      const updatedTeams = selectedTeams.includes(teamId)
        ? selectedTeams.filter((id) => id !== teamId)
        : [...selectedTeams, teamId];
      return { ...prev, [expandedPanel]: updatedTeams };
    });
  };

  const handleTeamAllotment = async () => {
    const selectedTeamIds = panelTeams[expandedPanel] || [];
    if (selectedTeamIds.length === 0) {
      alert("Please select at least one team.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/panel/allot-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: expandedPanel, teamIds: selectedTeamIds }),
      });
      if (response.ok) {
        alert("Teams allotted successfully!");
        const updatedResponse = await fetch("http://localhost:5000/api/panel/panels");
        const updatedPanels = await updatedResponse.json();
        setPanels(updatedPanels);
        setShowAllotPopup(false);
        setPanelTeams({ ...panelTeams, [expandedPanel]: [] });
      } else {
        console.error("Error allotting teams.");
      }
    } catch (error) {
      console.error("Error allotting teams:", error);
    }
  };
  const togglePanelDetails = async (panelId) => {
    if (!panelId || typeof panelId !== "string" || panelId.length !== 24) {
      console.error("❌ Invalid Panel ID:", panelId);
      alert("Invalid Panel ID. Please refresh and try again.");
      return;
    }
  
    console.log("📌 Fetching updated panel details for:", panelId);
  
    try {
      const response = await fetch(`http://localhost:5000/api/panel/panels`);
      const data = await response.json();
  
      // ✅ Ensure we match the correct panel
      const updatedPanel = data.find(panel => panel._id === panelId);
      if (!updatedPanel) {
        console.error("❌ Panel not found:", panelId);
        alert("Panel not found. Please refresh.");
        return;
      }
  
      console.log("✅ Updated Panel Details:", updatedPanel);
  
      // ✅ Update panels with latest data
      setPanels(prevPanels => prevPanels.map(panel => panel._id === panelId ? updatedPanel : panel));
  
      // ✅ Expand only the selected panel
      setExpandedPanel(expandedPanel === panelId ? null : panelId);
    } catch (error) {
      console.error("❌ Error fetching panel details:", error);
    }
  };

  const openAllotPopup = (panelId) => {
    setShowAllotPopup(prev => (expandedPanel === panelId ? false : true));
    setExpandedPanel(expandedPanel === panelId ? null : panelId);
  };

  return (
    <div className="panel-formation-container">
      <div className="panel-count-container">
        <h3>Total Panels Formed: {panels.length}</h3>
        <button className="show-panel-button" onClick={() => panelsRef.current.scrollIntoView({ behavior: "smooth" })}>
          Show Panels
        </button>
      </div>

      <div className="panel-content">
        <div className="search-container fixed">
          <input
            type="text"
            className="search-bar"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="back-button" onClick={() => navigate("/coordinator-dashboard")}>
            Back
          </button>
          <button className="form-panel-button" onClick={formPanel} disabled={selectedTeachers.length === 0}>
            Form Panel
          </button>
        </div>

        {/* Teachers List */}
        <div className="teachers-list">
          {teachers.map((teacher) => (
            <div key={teacher._id} className="teacher-flashcard">
              <span>{teacher.name}</span>
              <button className="select-button" onClick={() => toggleSelection(teacher)}>
                {selectedTeachers.some(t => t._id === teacher._id) ? "Deselect" : "Select in Panel"}
              </button>
            </div>
          ))}
        </div>

        {/* Display Formed Panels */}
        <div className="panels-section" ref={panelsRef}>
  <h3>Formed Panels</h3>
  {panels.length === 0 ? (
    <p>No panels formed yet.</p>
  ) : (
    panels.map((panel, index) => (
      <div key={panel._id || index} className={`panel-card ${expandedPanel === index ? "expanded" : ""}`}>
        <h4>Panel {index + 1}</h4>
        
        <p>
          Teachers: {panel.teacher_ids && panel.teacher_ids.length > 0 
            ? panel.teacher_ids.map(teacher => teacher?.name || "Unknown").join(", ") 
            : "No teachers assigned"}
        </p>

        <button className="details-button" onClick={() => togglePanelDetails(panel._id)}>
  {expandedPanel === panel._id ? "Hide Details" : "Show Details"}
   </button>

        <button className="allot-teams-button" onClick={() => openAllotPopup(panel._id)}>Allot Teams</button>
        {expandedPanel === panel._id && (
  <div className="panel-teams">
    <h5>Allotted Teams:</h5>
    {Array.isArray(panel.team_ids) && panel.team_ids.length > 0 ? (
  panel.team_ids.map((team, index) => (
    <p key={team?._id || `team-${index}`}>
      {team?.teamID || "Unknown Group"} ({team?.domain || "No Domain"}) 
    </p>
  ))
) : (
  <p>No teams allotted yet.</p>
)}

  </div>
)}

      </div>
    ))
  )}
  
</div>

        {showAllotPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <button className="close-btn" onClick={() => setShowAllotPopup(false)}>✖</button>
              <h3>Allot Teams to Panel</h3>
              <ul>
                {unallottedTeams.map((team) => (
                  <li key={team._id}>
                    <input
                      type="checkbox"
                      checked={(panelTeams[expandedPanel] || []).includes(team._id)}
                      onChange={() => handleCheckboxChange(team._id)}
                    />
                    {team.teamID} ({team.domain})
                  </li>
                ))}
              </ul>
              <button className="submit-popup" onClick={handleTeamAllotment}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelFormation;
 
