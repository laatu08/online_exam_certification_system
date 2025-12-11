import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './Home.css';
import { FaClipboardList, FaCertificate, FaUserGraduate } from "react-icons/fa";
import axios from 'axios';

const Home = () => {
    const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profile/me', { headers:{ Authorization: `Bearer ${localStorage.getItem('token')}` }});
      console.log(res);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };



  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-title">Welcome back, {user.name} 👋</h1>
        <p className="home-subtitle">Your journey towards excellence continues here.</p>
      </div>

      <div className="home-grid">
        <Link to="/exams" className="home-card">
          <FaClipboardList className="home-icon" />
          <h3>Take an Exam</h3>
          <p>Access available tests and start your assessment.</p>
        </Link>

        <Link to="/certificates" className="home-card">
          <FaCertificate className="home-icon" />
          <h3>Your Certificates</h3>
          <p>View and download your earned certificates.</p>
        </Link>

        <Link to="/me" className="home-card">
          <FaUserGraduate className="home-icon" />
          <h3>Your Profile</h3>
          <p>Edit your profile any time.</p>
        </Link>
      </div>

      <div className="home-stats">
        <div className="stat-box">
          <h2>{user.total_attempts}</h2>
          <p>Exams Completed</p>
        </div>

        <div className="stat-box">
          <h2>{user.passed_exams}</h2>
          <p>Certificates Earned</p>
        </div>

        <div className="stat-box">
          <h2>
            {((user.passed_exams/user.total_attempts)*100).toFixed(2)}
          </h2>
          <p>Success Rate</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
