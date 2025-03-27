import React, { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Teacher-components/LandingPage";
import Login from "./Login";
import Loginteacher from "./Login-teacher";
import StudentDashboard from "./Dashboards/StudentDashboard";
import MentorDashboard from "./Dashboards/MentorDashboard";
import CoordinatorDashboard from "./Dashboards/CoordinatorDashboard";
import TeamInvitation from "./Student-components/TeamInvitation";
import EvaluationPanel from "./Teacher-components/EvaluationPanel";

// ✅ PrivateRoute Component
const PrivateRoute = ({ children, role }) => {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const savedRole = useMemo(() => localStorage.getItem("role"), []);

  return token && savedRole === role ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* ✅ Login Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-teacher" element={<Loginteacher />} />

        {/* ✅ Student Dashboard */}
        <Route path="/dashboard" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />

        {/* ✅ Teacher Dashboard */}
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />

        {/* ✅ Coordinator Dashboard */}
        <Route path="/coordinator-dashboard/*" element={<PrivateRoute role="coordinator"><CoordinatorDashboard /></PrivateRoute>} />

        {/* ✅ Team Invitation Routes */}
        <Route path="/accept" element={<TeamInvitation />} />
        <Route path="/reject" element={<TeamInvitation />} />

        {/* ✅ Evaluation Panel Route (Restricted to Mentors in a Panel) */}
        <Route path="/evaluation-panel" element={<EvaluationPanel /> }/>

        {/* ✅ Redirect Unmatched Routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
