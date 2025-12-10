import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="exam-footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Online Exam System</p>
        <span className="footer-dot">•</span>
        <p>Built for Secure & Fair Assessments</p>
      </div>
    </footer>
  );
};

export default Footer;
