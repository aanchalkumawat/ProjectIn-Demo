import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Run once on mount
  useEffect(() => {
   document.body.classList.add("login-page");

    const token = localStorage.getItem("token");
    console.log("Checking token:", token); // ✅ Debugging
    if (token) {
      // Delay navigation to avoid maximum depth loop
      setTimeout(() => {
        console.log("Redirecting to /mentor-dashboard");
        navigate("/mentor-dashboard", { replace: true });
      }, 100); 
    }
    else {
      console.log("No token found, staying on login page.");
       navigate("/login-teacher", { replace: true });
    }
    return () => {
      document.body.classList.remove("login-page");
    };
  }, [navigate]); 

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    localStorage.removeItem("token"); // Clear old token before new login

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
      console.log("Login Response:", res.data);

      // Save token and user data
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
    <div className="login-container">
      <div className="login-form-container">
        <form onSubmit={handleSubmit}>
          <h1>Mentor Login</h1>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" // ✅ Fix for autocomplete
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" // ✅ Fix for autocomplete
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