import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import StudentDashboard from './Dashboards/StudentDashboard';
import TeacherDashboard from './Dashboards/TeacherDashboard';
import CoordinatorDashboard from './Dashboards/CoordinatorDashboard';
import TeamInvitation from './Student-components/TeamInvitation';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const savedRole = localStorage.getItem("role");

  return token && savedRole === role ? children : <Navigate to="/" />;
};

function App () {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />

        {/* Teacher Routes */}
        <Route path="/teacher-dashboard" element={<PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>} />

        {/* Coordinator Routes (Nested Routing) */}
        <Route path="/coordinator-dashboard/*" element={<PrivateRoute role="coordinator"><CoordinatorDashboard /></PrivateRoute>} />

        {/* Team Invitation Routes */}
        <Route path="/accept" element={<TeamInvitation />} />
        <Route path="/reject" element={<TeamInvitation />} />

        {/* Redirect Unmatched Routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
