import React, { useState } from "react";
import TeamForm from "./TeamForm";

const StudentDashboard = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <h2>Welcome to the Student Dashboard</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Team Form" : "Open Team Form"}
      </button>
      {showForm && <TeamForm />}
    </div>
  );
};

export default StudentDashboard;
