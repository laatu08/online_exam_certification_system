import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Import the external CSS file

const Navbar = () => {
  const isAdmin = localStorage.getItem('adminToken');
  
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        {isAdmin && (
          <>
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/exams" className="nav-link">Manage Exams</Link>
            </li>
          </>
        )}
        {!isAdmin ? (
          <li className="nav-item">
            <Link to="/login" className="nav-link">Login</Link>
          </li>
        ) : (
          <li className="nav-item">
            <button onClick={() => {
              localStorage.removeItem('adminToken');
              window.location.href = '/login';
            }} className="logout-button">Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
