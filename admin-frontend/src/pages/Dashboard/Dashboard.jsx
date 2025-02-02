import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className='dashboard-container'>
      <h2>Admin Dashboard</h2>
      <nav>
        <Link to="/exams">Manage Exams</Link>
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard
