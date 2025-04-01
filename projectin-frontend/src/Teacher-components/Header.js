// import React, { useState, useEffect } from "react";
// import "./Header.css";
// import Sidebar from "./Sidebar";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { FaCalendarAlt, FaUserCircle, FaRegClipboard } from "react-icons/fa";
// import axios from "axios";

// const Header = ({ onLogout }) => {
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [events, setEvents] = useState({});
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [eventText, setEventText] = useState("");
//   const [showProfile, setShowProfile] = useState(false);
//   const [mentorData, setMentorData] = useState(null);
//   const [showNotices, setShowNotices] = useState(false);
//   const [notifications, setNotifications] = useState([]);

//   // Fetch mentor data from localStorage
//   useEffect(() => {
//     const storedMentor = localStorage.getItem("mentor");
//     if (storedMentor) {
//       setMentorData(JSON.parse(storedMentor));
//     }
//   }, []);

//   // Fetch notifications from the backend
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/notifications/all")
//       .then((res) => {
//         if (res.data.success) {
//           setNotifications(res.data.data);
//         }
//       })
//       .catch((err) => console.error("Error fetching notifications:", err));
//   }, []);

//   const toggleCalendar = () => setShowCalendar(!showCalendar);
//   const toggleNotices = () => setShowNotices(!showNotices);

//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//     setEventText(events[date.toDateString()] || "");
//   };

//   const addEvent = () => {
//     if (selectedDate && eventText.trim()) {
//       setEvents((prev) => ({
//         ...prev,
//         [selectedDate.toDateString()]: eventText,
//       }));
//       setEventText("");
//       setSelectedDate(null);
//     }
//   };

//   const tileContent = ({ date }) => {
//     return events[date.toDateString()] ? (
//       <div className="event-dot" title={events[date.toDateString()]}></div>
//     ) : null;
//   };

//   return (
//     <header className="dashboard-header">
//       <Sidebar />
//       <div className="dashboard-header-text">Mentor Dashboard</div>
//      {/* Logo */}
//      {/* <img src={logo} alt="Banasthali Vidyapeeth Logo" className="bvlogo" /> */}

// {/* Heading */}
// <div className="dashboard-header-text">Mentor Dashboard</div>
//       {/* Calendar */}
//       <div className="calendar-container">
//         <FaCalendarAlt className="calendar-icon" onClick={toggleCalendar} />
//         {showCalendar && (
//           <div className="calendar-popup">
//             <Calendar
//               onClickDay={handleDateClick}
//               tileContent={tileContent}
//               className="custom-calendar"
//             />
//             {selectedDate && (
//               <div className="event-input">
//                 <input
//                   type="text"
//                   placeholder="Add event"
//                   value={eventText}
//                   onChange={(e) => setEventText(e.target.value)}
//                 />
//                 <button onClick={addEvent}>Save</button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Notice (Clipboard) Icon */}
//       <div className="notice-container">
//         <FaRegClipboard className="icon notice-icon" onClick={toggleNotices} />
//         {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
//       </div>

//       {/* Profile Icon */}
//       <div className="profile-container">
//         <FaUserCircle className="icon profile-icon" onClick={() => setShowProfile(!showProfile)} />

//         {/* Profile Dropdown */}
//         {showProfile && mentorData && (
//           <div className="profile-dropdown">
//             <p><strong>ID:</strong> {mentorData.id}</p>
//             <p><strong>Name:</strong> {mentorData.name}</p>
//             <p><strong>Email:</strong> {mentorData.email}</p>
//           </div>
//         )}
//       </div>

//       <button className="logout-button" onClick={onLogout}>Logout</button>

//       {/* Notification Popup */}
//       {showNotices && (
//         <div className="notification-overlay">
//           <div className="notification-popup">
//             <h2>📢 Notices</h2>
//             <ul>
//               {notifications.length > 0 ? (
//                 notifications.map((note, index) => <li key={index}>{note.message}</li>)
//               ) : (
//                 <h2>No new notices</h2>
//               )}
//             </ul>
//             <button onClick={toggleNotices}>Close</button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;
import React, { useState, useEffect } from "react";
import "./Header.css";
import Sidebar from "./Sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt, FaUserCircle, FaRegClipboard } from "react-icons/fa";
import axios from "axios";
import logo from "../assests/images/Banasthali_Vidyapeeth_Logo.png"; // Importing the logo

const Header = ({ onLogout }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventText, setEventText] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [mentorData, setMentorData] = useState(null);
  const [showNotices, setShowNotices] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch mentor data from localStorage
  useEffect(() => {
    const storedMentor = localStorage.getItem("mentor");
    if (storedMentor) {
      setMentorData(JSON.parse(storedMentor));
    }
  }, []);

  // Fetch notifications from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/notifications/all")
      .then((res) => {
        if (res.data.success) {
          setNotifications(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  const toggleCalendar = () => setShowCalendar(!showCalendar);
  const toggleNotices = () => setShowNotices(!showNotices);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEventText(events[date.toDateString()] || "");
  };

  const addEvent = () => {
    if (selectedDate && eventText.trim()) {
      setEvents((prev) => ({
        ...prev,
        [selectedDate.toDateString()]: eventText,
      }));
      setEventText("");
      setSelectedDate(null);
    }
  };

  const tileContent = ({ date }) => {
    return events[date.toDateString()] ? (
      <div className="event-dot" title={events[date.toDateString()]}></div>
    ) : null;
  };

  return (
    <header className="dashboard-header">
      <Sidebar />

      {/* Logo */}
      <img src={logo} alt="Banasthali Vidyapeeth Logo" className="bvlogo" />

      {/* Heading */}
      <div className="dashboard-header-text">Mentor Dashboard</div>

     

      {/* Notice (Clipboard) Icon */}
      <div className="notice-container">
        <FaRegClipboard className="icon notice-icon" onClick={toggleNotices} />
        {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </div>

      {/* Profile Icon */}
      <div className="profile-container">
        <FaUserCircle className="icon profile-icon" onClick={() => setShowProfile(!showProfile)} />

        {/* Profile Dropdown */}
        {showProfile && mentorData && (
          <div className="profile-dropdown">
            <p><strong>ID:</strong> {mentorData.id}</p>
            <p><strong>Name:</strong> {mentorData.name}</p>
            <p><strong>Email:</strong> {mentorData.email}</p>
          </div>
        )}
      </div>

      <button className="logout-button" onClick={onLogout}>Logout</button>

      {/* Notification Popup */}
      {showNotices && (
        <div className="notification-overlay">
          <div className="notification-popup">
            <h2>📢 Notices</h2>
            <ul>
              {notifications.length > 0 ? (
                notifications.map((note, index) => <li key={index}>{note.message}</li>)
              ) : (
                <h2>No new notices</h2>
              )}
            </ul>
            <button onClick={toggleNotices}>Close</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;