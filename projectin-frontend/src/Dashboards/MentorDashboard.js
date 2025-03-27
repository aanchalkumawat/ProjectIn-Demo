// import React, { useState, useEffect } from "react";
// import { Routes, Route, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
// import RequestsSection from "../Teacher-components/RequestsSection";
// import AcceptedTeamsSection from "../Teacher-components/AcceptedTeamsSection";
// import Header from "../Teacher-components/Header";
// import EvaluationPanel from "../Teacher-components/EvaluationPanel";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./MentorDashboard.css";

// const MentorDashboard = () => {
//   const [requests, setRequests] = useState([]);
//   const [acceptedTeams, setAcceptedTeams] = useState([]);
//   const [mentor, setMentor] = useState(null); // ✅ Store mentor object
//   const navigate = useNavigate(); // ✅ Added useNavigate()
//   console.log("Mentor from LocalStorage:", JSON.parse(localStorage.getItem("mentor")));
//   useEffect(() => {
//     console.log("MentorDashboard mounted!");
//   }, []);
//    // Function to handle adding new accepted team
//    const handleTeamAccepted = (newTeam) => {
//     console.log("📥 Adding new team to state:", newTeam);
//     setAcceptedTeams((prevTeams) => [newTeam, ...prevTeams]);
//   };
//   useEffect(() => {
//     const storedMentor = JSON.parse(localStorage.getItem("mentor"));
//     if (storedMentor) {
//       setMentor(storedMentor);
//     } else {
//       toast.error("Mentor not logged in!");
//       navigate("/login-teacher"); // Redirect to login if no mentor found
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (mentor?.id) {
//       console.log("Mentor ID:", mentor.id);
//       fetchRequests();
//       fetchAcceptedTeams();
//     }
//   }, [mentor]); // ✅ Only fetch after mentor is available
//     const fetchRequests = async () => {
//       try {
//         if (!mentor?.id) {
//           console.warn("⚠️ No Mentor ID Found");
//           return;
//         }
//         console.log("🆔 Mentor ID from state:", mentor?.id);

//         const response = await axios.get(`http://localhost:5000/api/mentor-requests/${mentor.id}`);
//         console.log("Fetched Requests:", response.data);
//         setRequests(response.data);
//       } catch (error) {
//         console.error("Error fetching mentor requests:", error);
//       }
//     };
//     const fetchAcceptedTeams = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/accepted-requests");
//         setAcceptedTeams(response.data);
//       } catch (error) {
//         console.error("❌ Error fetching accepted teams:", error.response?.data || error.message);
//       }
//     };

//   const handleAccept = async (id) => {
//     try {
//       const acceptedRequest = requests.find((req) => req._id === id);
//       if (!acceptedRequest) {
//         console.warn("⚠️ Request not found!");
//         return;
//       }

//       await axios.post("http://localhost:5000/api/accepted-requests", { id });

//       setAcceptedTeams((prev) => [...prev, acceptedRequest]);
//       setRequests(requests.filter((req) => req._id !== id));

//       toast.success("Request Accepted Successfully!");
//     } catch (error) {
//       console.error("Error accepting request:", error);
//       toast.error("Failed to accept request.");
//     }
//   };

//   const handleReject = (id) => {
//     setRequests(requests.filter((req) => req._id !== id));
//   };

//   const handleRevise = (id) => {
//     toast.success("Revise request sent to student dashboard");
//     setRequests(requests.filter((req) => req._id !== id));
//   };
// // Logout Functionality
// const handleLogout = () => {
//   localStorage.removeItem("token"); // Remove token
//   localStorage.removeItem("mentor"); // Remove mentor data
//   toast.success("Logged out successfully");
//   navigate("/login-teacher"); // Redirect to login page
// };

//   return (
//     <div className="dashboard-container">
//       <Header onLogout={handleLogout} className="dashboard-header" />
//       <main className="dashboard-main">
//         {/* ✅ Ensure clicking "Evaluation Panel" in the sidebar navigates correctly */}
//         {/* <button onClick={() => navigate("/evaluation-panel")}>Go to Evaluation Panel</button> */}

//         <Routes> {/* ✅ Ensure Routes is properly wrapping components */}
//           <Route 
//             path="/mentor-dashboard" 
//             element={
//               <>
//                 <RequestsSection mentor={mentor} 
//                  requests={requests}
//                  setRequests={setRequests}/>

//                 {requests.length > 0 && (
//                   <div className="accepted-section">
//                     <AcceptedTeamsSection mentor={mentor} />
//                   </div>
//                 )}
//               </>
//             } 
//           />
//           <Route path="/evaluation-panel" element={<EvaluationPanel />} /> {/* ✅ Fixed navigation */}
//         </Routes>
//       </main>
//       <footer className="dashboard-footer">
//         &copy; 2025 Team Management
//       </footer>
//       <ToastContainer />
//     </div>
//   );
// };

// export default MentorDashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import RequestsSection from "../Teacher-components/RequestsSection";
import AcceptedTeamsSection from "../Teacher-components/AcceptedTeamsSection";
import Header from "../Teacher-components/Header";
import EvaluationPanel from "../Teacher-components/EvaluationPanel";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MentorDashboard.module.css";

const MentorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [acceptedTeams, setAcceptedTeams] = useState([]);
  const [mentor, setMentor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMentor = JSON.parse(localStorage.getItem("mentor"));
    if (storedMentor) {
      setMentor(storedMentor);
    } else {
      toast.error("Mentor not logged in!");
      navigate("/login-teacher"); // Redirect if not logged in
    }
  }, [navigate]);

  useEffect(() => {
    if (mentor?.id) {
      fetchRequests();
      fetchAcceptedTeams();
    }
  }, [mentor]);

  const fetchRequests = async () => {
    try {
      if (!mentor?.id) return;
      const response = await axios.get(`http://localhost:5000/api/mentor-requests/${mentor.id}`);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching mentor requests:", error);
    }
  };

  const fetchAcceptedTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/accepted-requests");
      setAcceptedTeams(response.data);
    } catch (error) {
      console.error("Error fetching accepted teams:", error);
    }
  };

  // Handle team acceptance and update state
  const handleTeamAccepted = (newTeam) => {
    setAcceptedTeams((prevTeams) => [newTeam, ...prevTeams]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mentor");
    toast.success("Logged out successfully");
    navigate("/login-teacher");
  };

  return (
    <div className="dashboard-container">
      <Header onLogout={handleLogout} className="dashboard-header" />
      <main className="dashboard-main">
        {/* Display Requests Section */}
        <RequestsSection 
          mentor={mentor} 
          requests={requests} 
          setRequests={setRequests} 
          onTeamAccepted={handleTeamAccepted} 
        />

        {/* Display Accepted Teams Section */}
        {acceptedTeams.length > 0 && (
          <AcceptedTeamsSection mentor={mentor} acceptedTeams={acceptedTeams} />
        )}
      </main>
      <footer className="dashboard-footer">
        &copy; 2025 Team Management
      </footer>
      <ToastContainer />
    </div>
  );
};

export default MentorDashboard;
