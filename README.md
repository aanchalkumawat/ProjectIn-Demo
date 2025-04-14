# ProjectIn-Demo
In House College Project
# ProjectIN - In House Project Management System

ProjectIN is a MERN-stack based web application built to streamline the process of managing student academic projects. It is designed for use by students, mentors, coordinators, and panelists to handle everything from team creation to evaluation and document submission.

---

## 🔧 Tech Stack

- **Frontend:** React.js, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Others:** JWT Authentication, Nodemailer, Multer, CORS, REST APIs, Excel, PDF Reader

---

## 🚀 Features

### 🎓 Students
- Team creation and invitation system
- Request mentors
- Submit project files
- View notices and deadlines
- Track proposal & final submission status

### 🧑‍🏫 Teachers / Mentors
- Accept/reject/revise mentorship requests
- Evaluate assigned teams
- Track team progress
- Get panel evaluation access if assigned

### 🧑‍💼 Coordinators
- Set deadlines and team limits
- Freeze teams
- Form evaluation panels
- Import student , teacher and coordinator data
- export student and project data
- Assign marks and send notices
-flush all data except coordinator data 
---

## 🖥️ Installation Guide

### 📦 Backend Setup

1. Open your terminal and navigate to the backend directory:
    ```bash
   cd ProjectIn-backend
2. Install backend dependencies:
    ```bash
   npm install
3. Create a .env file and configure your environment variables:
     ```bash
     PORT=5000
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
4. Start the backend server:
    ```bash
     node app.js


###  🌐 Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd projectin-frontend
2. Install frontend dependencies:
   ```bash
   npm install
3. Start the React app:
    ```bash
    npm start
