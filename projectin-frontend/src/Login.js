import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Navigation
import "./LoginForm.css";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("selecting-option"); // Default selection
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Ensure user is logged out when arriving at the login page
  useEffect(() => {
    console.log("🔍 Checking for existing session...");
    const token = localStorage.getItem("token");

    if (token) {
      console.log("✅ Session Found! Redirecting...");
      const savedRole = localStorage.getItem("role");
      navigate(savedRole === "student" ? "/dashboard" : "/coordinator-dashboard");
    } else {
      console.log("🗑️ No session found. Clearing localStorage.");
      localStorage.clear();
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (role === "selecting-option") {
      setError("Please select a role.");
      return;
    }

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const { data } = await axios.post(endpoint, { email, password, role });

      if (isLogin) {
        console.log("🟢 Login Successful!", data);

        // Save user details in localStorage (including team details)
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(data.user)); // Store full user object

        // Redirect based on role
        if (role === "student") {
          alert("Login successful!");
          navigate("/dashboard");
        } else if (role === "coordinator") {
          alert("Login successful!");
          navigate("/coordinator-dashboard");
        }
      } else {
        alert("Signup successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-stud-login">
      <div className="second-container-stud-login">
        <div className="form-container-stud-login">
          <div className="log-logo-teacher-login"></div>
          <form onSubmit={handleSubmit}>
            <div className="form">
              <h1>{isLogin ? "Login Form" : "Signup Form"}</h1>

              {/* Role Selection */}
              <select
                className="dropdown-stud"
                onChange={(e) => setRole(e.target.value)}
                value={role}
                required
              >
                <option value="selecting-option">Select Your Role</option>
                <option value="student">Student</option>
                <option value="coordinator">Coordinator</option>
              </select>

              <input
                type="email"
                placeholder="Enter Banasthali mail ID"
                value={email}
                className="stud-login-input-email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                className="stud-login-input-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}
              {error && <p className="error-message">{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
              </button>

              {isLogin ? (
                <p>
                  <a href="#" onClick={() => setIsLogin(false)}></a>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <a href="#" onClick={() => setIsLogin(true)}>
                    Login
                  </a>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
