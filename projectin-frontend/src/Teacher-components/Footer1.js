import React from "react";
import "./Footer1.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Notified Under Section (3) of University Grants Commission Act.</p>
        <p>&copy; 2025 Banasthali Vidyapith.</p>
      </div>
      
      <div className="social-icons">
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <FaFacebookF />
  </a>
  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
    <FaTwitter />
  </a>
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <FaInstagram />
  </a>
  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
    <FaLinkedin />
  </a>
</div>

    </footer>
  );
};

export default Footer;
