import React, { useState } from "react";
import axios from "axios";
import "./LoginForm.css";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState(""); // Email input
  const [password, setPassword] = useState(""); // Password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm Password for signup
  const [error, setError] = useState(""); // Error message

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const data = { email, password };
      const res = await axios.post(endpoint, data);

      if (isLogin) {
        // Save token in localStorage
        localStorage.setItem("token", res.data.token);
        alert("Login successful!");
        window.location.href = "/dashboard"; // Redirect to dashboard
      } else {
        alert("Signup successful! You can now log in.");
        setIsLogin(true); // Switch to login form after successful signup
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-toggle">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
            Signup
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <h1>{isLogin ? "Login Form" : "Signup Form"}</h1>
            <input
              type="email"
              placeholder="Enter Banasthali mail ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
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
            {isLogin && <a href="#">Forgot Password?</a>}
            {error && <p className="error-message">{error}</p>}
            <button type="submit">{isLogin ? "Login" : "Signup"}</button>
            {isLogin ? (
              <p>
                Not a Member? <a href="#" onClick={() => setIsLogin(false)}>Signup now</a>
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
  );
}


