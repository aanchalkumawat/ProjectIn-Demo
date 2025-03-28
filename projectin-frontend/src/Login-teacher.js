import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginTeacher.css"; // ✅ Uses existing styles

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-page");

    const token = localStorage.getItem("token");
    if (token) {
      setTimeout(() => {
        navigate("/mentor-dashboard", { replace: true });
      }, 100);
    }
    
    return () => {
      document.body.classList.remove("login-page");
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    localStorage.removeItem("token");

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/authone/login", 
        { email, password }, 
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("mentor", JSON.stringify(res.data.user));
      alert("Login successful!");
      navigate("/mentor-dashboard", { replace: true }); 
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">  {/* ✅ Matches student login styling */}
      <div className="form-container"> {/* ✅ Matches student login styling */}
        <form onSubmit={handleSubmit}>
          <h2>Login Form</h2>  {/* ✅ Matches student login styling */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
