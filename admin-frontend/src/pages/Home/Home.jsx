import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { FaPlusCircle, FaListUl } from "react-icons/fa";

const Home = () => {
  return (
    <div className="admin-home">

      {/* Header */}
      <div className="home-header">
        <h1>Exam Management Panel</h1>
        <p>Create, organize, and manage all exams from one place.</p>
      </div>

      {/* Exam Actions */}
      <div className="exam-actions">
        
        <div className="exam-card">
          <FaPlusCircle className="exam-icon" />
          <h3>Create New Exam</h3>
          <p>Add a new exam with full customization.</p>
          <Link to="/exams/create" className="action-btn">Create Exam →</Link>
        </div>

        <div className="exam-card">
          <FaListUl className="exam-icon" />
          <h3>View All Exams</h3>
          <p>Manage questions, edit exams, and more.</p>
          <Link to="/exams/list" className="action-btn">View Exams →</Link>
        </div>

      </div>

    </div>
  );
};

export default Home;
