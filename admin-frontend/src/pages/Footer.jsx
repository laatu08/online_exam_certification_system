import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} ExamEase Admin Panel</span>
        <span className="footer-divider">|</span>
        <span>All Rights Reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
