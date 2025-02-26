import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import CoordinatorDashboard from './CoordinatorDashboard';
const PrivateRoute = ({ element, role }) => {
  const token = localStorage.getItem("token");
  const savedRole = localStorage.getItem("role");

  return token && savedRole === role ? element : <Navigate to="/" />;
};

function App () {
  return(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<PrivateRoute element={<StudentDashboard />} role="student" />} />
      <Route path="/TeacherDashboard" element={<PrivateRoute element={<TeacherDashboard />} role="teacher" />} />
        <Route path="/CoordinatorDashboard" element={<PrivateRoute element={<CoordinatorDashboard />} role="coordinator" />} />

        {/* Redirect Unmatched Routes */}
        <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  </Router>
);
}

export default App;

