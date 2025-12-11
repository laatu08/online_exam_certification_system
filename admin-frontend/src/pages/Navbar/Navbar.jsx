import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const isAdmin = localStorage.getItem('adminToken');
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">AdminPanel</div>

      <ul className="nav-list">
        <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
        </li>

        {isAdmin && (
          <>
            <li className={`nav-item ${location.pathname === '/exams/create' ? 'active' : ''}`}>
              <Link to="/exams/create" className="nav-link">Create Exams</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/exams/list' ? 'active' : ''}`}>
              <Link to="/exams/list" className="nav-link">All Exams</Link>
            </li>
          </>
        )}

        {!isAdmin ? (
          <li className="nav-item">
            <Link to="/login" className="nav-link login-btn">Login</Link>
          </li>
        ) : (
          <li className="nav-item">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
