import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign-Up
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Default role for sign-up
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      // Handle Sign-Up
      try {
        const res = await axios.post("http://localhost:5000/api/auth/register", formData);
        alert(res.data.message);
        setIsSignUp(false); // Switch back to login mode after successful sign-up
      } catch (error) {
        console.error("Error during sign-up:", error);
        alert(error.response?.data?.message || "Sign-up failed");
      }
    } else {
      // Handle Login
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        alert(res.data.message);
        localStorage.setItem("token", res.data.token);
        // Redirect to dashboard
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Error during login:", error);
        alert(error.response?.data?.message || "Login failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      
      {isSignUp && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      )}
      
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
      
      <p>
        {isSignUp ? "Already have an account?" : "New user?"}{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Login" : "Sign Up"}
        </span>
      </p>
    </form>
  );
};

export default Login;

