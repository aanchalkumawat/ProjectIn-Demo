import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RequestsSection.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const RequestsSection = ({ mentor ,onTeamAccepted}) => {
  //console.log("✅ RequestSection mounted!");

  const [requests, setRequests] = useState([]);


    // Fetch mentor requests from the database
    useEffect(() => {
        if (mentor?.id) {
            fetchRequests();
        }
    }, [mentor]);
      const fetchRequests = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/mentor-requests/${mentor.id}`);
          setRequests(response.data || []);
          //console.log("📥 Requests fetched:", response.data);

        } catch (error) {
          console.error("Error fetching mentor requests:", error);
        }
      };
       // Function to fetch student email
  const fetchStudentEmail = async (rollno) => {
    try {
      console.log(`Fetching email for rollno: ${rollno}`);
      const response = await axios.get(`http://localhost:5000/api/students/${rollno}`);
      return response.data.email || null;
    } catch (error) {
      console.error(`Error fetching email for rollno: ${rollno}`, error);
      return null;
    }
  };

  // Function to send email notification
  // const sendEmailNotification = async (email, subject, message) => {
  //   try {
  //     await axios.post("http://localhost:5000/api/send-email", {
  //       projectName: request.projectName,
  //       action: subject.includes("Accepted") ? "Accepted" :
  //               subject.includes("Rejected") ? "Rejected" :
  //               "Revised",
  //     });
      
  //     console.log(`📧 Email sent successfully to ${email}`);
  //   } catch (error) {
  //     console.error("❌ Error sending email:", error);
  //   }
  // };
  const sendEmailNotification = async (email, subject, message, request) => {
    console.log("request in fcn:",request);
    console.log("projectname in fcn:",request.projectName);
    console.log("email in fcn:",email);
    console.log("subject in fcn:",subject);
    console.log("message in fcn:",message);
// Determine the action based on subject content
const action = (() => {
  if (subject.toLowerCase().includes("accepted")) {
    return "Accepted";
  }
  if (subject.toLowerCase().includes("rejected")) {
    return "Rejected";
  }
  if (subject.toLowerCase().includes("revised")) {
    return "Revised";
  }
  return "na"; // default case if none match
})();
console.log("action in fcn:",action);
    try {
      const emailData = {
        email,  // Recipient email
        subject, // Email subject
        message, // Email body content 
     
        projectName: request.projectName, // Project name
        action
      };
      console.log("request is:",request);
      console.log("📤 Sending email data:", emailData);
  
      await axios.post("http://localhost:5000/api/send-email", emailData);
      
    } catch (error) {
       if (error.request) {
          console.error("❌ No response received from server:", error.request);
      }else if (error.response) {
        console.error("❌ Server responded with error:", error.response.status, error.response.data);
    }else {
          console.error("❌ Error in setting up request:", error.message);
      }
  }
  
  };
  

      // Function to generate unique team name
  const generateTeamName = (projectName="Project") => {
    return `Team_${projectName.replace(/\s+/g, "_")}_${Math.floor(
      Math.random() * 1000
    )}`;
  };
const handleAccept = async (request) => {
  console.log("🟢 Full Request Object:", request);


  if (!request || !request.projectName || !request.teamMembers || !request.description||
    !Array.isArray(request.teamMembers) || !mentor) {
      console.error("❌ Missing required request fields:", request);
      return;
  }
  const teamName = generateTeamName(request.projectName);

console.log("🔹 Generated Team Name:", teamName);
  try {
     // 1️⃣ Fetch global maxTeams limit from backend (for all mentors)
    console.log("🚀 Fetching team limit for all mentors");

     const teamLimitResponse = await axios.get(`http://localhost:5000/api/team-limits/`);
     const maxTeams = teamLimitResponse.data.maxTeams;
 
     // 2️⃣ Fetch current count of accepted teams for this mentor
     const acceptedCountResponse = await axios.get(`http://localhost:5000/api/accepted-requests/count?mentorId=${mentor.id}`);
     const acceptedTeamsCount = acceptedCountResponse.data.count;
 
     console.log(`📌 Max Teams Allowed: ${maxTeams}, Already Accepted: ${acceptedTeamsCount}`);
 
     // 3️⃣ Check if the mentor has reached the limit
     if (acceptedTeamsCount >= maxTeams) {
       toast.error("Max limit reached. No more teams can be accepted.");
       return;
     }
      const response = await axios.post("http://localhost:5000/api/accepted-requests", {
          id: request._id,
          teamName, // ✅ Using generated team name
          projectName: request.projectName,
          teamMembers: request.teamMembers.map((member) => ({
              name: member.name || "Unknown",
              rollno: member.rollno || "N/A",
          })),
          description: request.description,
          mentorId: mentor.id,
          mentorName: mentor.name,
      }, {
          headers: { "Content-Type": "application/json" }
      });
      toast.success("Request Accepted");
      await fetchRequests();
          // ✅ Check response
    console.log("✅ Request Accepted:", response.data);
    if(onTeamAccepted)
    {
      onTeamAccepted(response.data.acceptedRequest);
    }
    // Fetch student email
    const firstMember = request.teamMembers[0];
    console.log("teammember:",firstMember);
    if (firstMember) {
      const studentEmail = await fetchStudentEmail(firstMember.rollno);
      if (studentEmail) {
        await sendEmailNotification(
          studentEmail,
          "Accepted",
          `Your project  has been accepted by ${mentor.name}.`,
          request
        );
      }
    }
await axios.delete(`http://localhost:5000/api/mentor-requests/${encodeURIComponent(request.projectName)}`);

setRequests((prevRequests) => 
  prevRequests.filter((req) => req.projectName !== request.projectName)
);

  } catch (error) {
      console.error("❌ Request failed:", error.response ? error.response.data : error.message);
      toast.error("Failed to accept request.");
  }
};

const handleReject = async (request) => {
  if (!request || !request.projectName) {
    console.error("❌ Missing request or projectName:", request);
    return;
  }
  console.log("❌ Rejecting request for project:", request.projectName);

  try {
    const response = await fetch(`http://localhost:5000/api/mentor-requests/${request.projectName}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }, 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to reject request: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Request rejected:", data);

    // ✅ Remove the rejected request from the UI
    setRequests((prevRequests) => 
      prevRequests.filter((req) => req.projectName !== request.projectName)
    );
     // Fetch student email
     const firstMember = request.teamMembers[0];
    if (firstMember) {
      const studentEmail = await fetchStudentEmail(firstMember.rollno);
      if (studentEmail) {
        await sendEmailNotification(
          studentEmail,
          "Rejected",
          `Your project has been rejected by ${mentor.name}.`,
          request
        );
      }
    }
  } catch (error) {
    console.error("Error rejecting request:", error);
  }
};

const handleRevise = async (request) => {
  console.log("🔍 Full Request Object:", request);
  try {
    // 1️⃣ Send request data to the new "reviserequests" collection
    const response = await axios.post("http://localhost:5000/api/revised-requests", {
      projectName: request.projectName,
      teamMembers: request.teamMembers.map((member) => ({
        name: member.name || "Unknown",
        rollNo: member.rollno || "N/A",
      })),
      description:request.description,
    }, {
      headers: { "Content-Type": "application/json" }
    });

    console.log("✅ Request moved to revise-requests:", response.data);
     // Show success toast notification
     toast.success("Revise request sent to student dashboard");
    // 2️⃣ Update UI to remove the request
    // setRequests(prevRequests => prevRequests.filter((req) => req._id !== request._id));
    // 🔍 Refetch updated requests from the database
    await fetchRequests();
    // Fetch student email
    const firstMember = request.teamMembers[0];
    console.log("teammember:",firstMember);
    console.log("request:",request);
    console.log("firstMember.rollno",firstMember.rollno);
    
    if (firstMember) {
      const studentEmail = await fetchStudentEmail(firstMember.rollno);
      console.log("studentemail:",studentEmail);
      if (studentEmail) {
        await sendEmailNotification(
          studentEmail,
          "Revised",
          `Your projectrequires revision. Please contact ${mentor.name} for more discussion then you may send the updated request again accordingly.`,
          request
        );
      }
    }
  } catch (error) {
    console.error("❌ Error revising request:", error.response ? error.response.data : error.message);
  }
};

  return (
    <section className="requests-section">
      <h2 className="req">Requests</h2>
      <div className="requests-list">
        {requests.length === 0 ? (
        <p>No requests available.</p>
      ) : (
        requests.map((request) => (
          
          <div key={request._id} className="request-item" >
            <p><strong>Project:</strong> {request.projectName}</p>
            <p><strong>Team:</strong> {request.description}</p>
            <div className="request-buttons">

<button
  onClick={() => {
    console.log("Clicked Accept for:", request);

    if (!request) {
      console.error("❌ Missing required request fields:", request);
      return;
    }
    if (!request.projectName ) {
      console.error("❌ Missing required request projectname fields:", request);
      return;
    }
    if (!request.teamMembers) {
      console.error("❌ Missing required request member fields:", request);
      return;
    }
    handleAccept(request);
  }}
  className="accept-button"
>
  Accept
</button>
              <button onClick={() => handleReject(request)} className="reject-button">
                Reject
              </button>
              <button onClick={() => handleRevise(request)} className="revise-button">
                Revise
              </button>
              <div className="dropdown">
                <button className="more-button">More</button>
                <ul className="dropdown-list">
                    {Array.isArray(request.teamMembers) && request.teamMembers.length > 0 ? (
                      request.teamMembers.map((member) => (
                        <li key={member.rollno || member.name}>
                          {member.name || "Unknown"} ({member.rollno || "N/A"})
                        </li>
                      ))
                    ) : (
                      <li>No members available.</li>
                    )}
                  </ul>
              </div>
            </div>
          </div>
        )))}
      </div>
    </section>
  );
};

export default RequestsSection;