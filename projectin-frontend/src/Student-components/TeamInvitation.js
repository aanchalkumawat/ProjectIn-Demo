import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const TeamInvitation = () => {
  const location = useLocation();
  const [message, setMessage] = useState("Processing...");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const teamID = searchParams.get("teamID");
    const memberID = searchParams.get("memberID");
    const action = location.pathname.includes("accept") ? "accept" : "reject";

    if (!teamID || !memberID) {
      setMessage("Invalid request parameters.");
      return;
    }

    axios
      .get(`http://localhost:5000/api/team/${action}?teamID=${teamID}&memberID=${memberID}`)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(`Error processing ${action}:`, error);
        setMessage("Error processing your request. Please try again.");
      });
  }, [location]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default TeamInvitation;
