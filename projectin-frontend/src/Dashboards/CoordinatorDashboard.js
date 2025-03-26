import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import TopBanner from "../components/TopBanner/TopBanner";
import Sidebar from "../components/Sidebar/Sidebar";
import Flashcards from "../components/Flashcards/Flashcards";
import PanelFormation from "../components/Flashcards/PanelFormation";
import RequestSubmissionModal from "../components/Sidebar/RequestSubmissionModal";
import Marks from "../components/Sidebar/Marks"; // ✅ Importing Marks Component

const CoordinatorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isRequestSubmissionPopupOpen, setIsRequestSubmissionPopupOpen] = useState(false);

  const navigate = useNavigate(); // ✅ For Redirecting

  useEffect(() => {
    navigate(""); // ✅ Redirect to default page when opening Coordinator Dashboard
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleStudentDropdown = () => setIsStudentDropdownOpen((prev) => !prev);
  const toggleTeamDropdown = () => setIsTeamDropdownOpen((prev) => !prev);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen((prev) => !prev);

  const openRequestSubmissionPopup = () => setIsRequestSubmissionPopupOpen(true);
  const closeRequestSubmissionPopup = () => setIsRequestSubmissionPopupOpen(false);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className={`dashboard ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <TopBanner
        toggleSidebar={toggleSidebar}
        toggleProfileDropdown={toggleProfileDropdown}
        isProfileDropdownOpen={isProfileDropdownOpen}
        handleLogout={handleLogout}
      />

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleStudentDropdown={toggleStudentDropdown}
        toggleTeamDropdown={toggleTeamDropdown}
        isStudentDropdownOpen={isStudentDropdownOpen}
        isTeamDropdownOpen={isTeamDropdownOpen}
        openRequestSubmissionPopup={openRequestSubmissionPopup}
      />

      <main className={`content ${isSidebarOpen ? "shifted" : ""}`}>
        <Routes>
          <Route path="/" element={<Flashcards />} /> {/* ✅ Default Route */}
          <Route path="panel-formation" element={<PanelFormation />} />
          <Route path="marks" element={<Marks />} />
        </Routes>
      </main>

      <RequestSubmissionModal
        isOpen={isRequestSubmissionPopupOpen}
        onClose={closeRequestSubmissionPopup}
        onSubmit={(data) => console.log("Submission Data:", data)}
      />
    </div>
  );
};

export default CoordinatorDashboard;
