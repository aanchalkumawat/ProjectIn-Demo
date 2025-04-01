import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Navigation
import "./LoginForm.css";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(""); // User role selection
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    console.log("🔍 Clearing old session...");
    localStorage.clear();
  }, []);
  // 🔹 Ensure login form is the first screen (Prevent auto-redirection)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Redirect user to their role-based dashboard if already logged in
      const savedRole = localStorage.getItem("role");
      if (savedRole === "student") navigate("/dashboard");
      else if (savedRole === "teacher") navigate("/teacher-dashboard");
      else if (savedRole === "coordinator") navigate("/coordinator-dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
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

      const data = { email, password, role };
      const res = await axios.post(endpoint, data);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", role);
        alert("Login successful!");

        // 🔹 Redirect user based on role
        if (role === "student") navigate("/dashboard");
        else if (role === "coordinator") navigate("/coordinator-dashboard");
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
        <div className="form-toggle-stud">
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <h1>{isLogin ? "Login Form" : "Signup Form"}</h1>

            {/* Role Selection */}
            <select class="dropdown-stud" onChange={(e) => setRole(e.target.value)} value={role} required>
              <option value="selecting-option">Select Your Role</option>
              <option value="student">Student</option>
              <option value="coordinator">Coordinator</option>
            </select>

            <input
              type="email"
              placeholder="Enter Banasthali mail ID"
              value={email}
              class="stud-login-input-email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              class="stud-login-input-password"
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
                Already have an account? <a href="#" onClick={() => setIsLogin(true)}>Login</a>
              </p>
            )}
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
