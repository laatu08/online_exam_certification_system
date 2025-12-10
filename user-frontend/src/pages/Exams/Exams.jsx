import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Exams.css';
import { FaBook, FaClock, FaQuestionCircle, FaStar } from "react-icons/fa";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate=useNavigate()

  useEffect(() => {
    axios.get('http://localhost:5000/api/user/', {
      headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        setExams(response.data);
        setFiltered(response.data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching exams', error));
  }, []);

  // search filter
  const handleSearch = (value) => {
    setSearch(value);
    setFiltered(exams.filter(ex => ex.title.toLowerCase().includes(value.toLowerCase())));
  };

  return (
    <div className="exams-page">
      <h1 className="exams-title">Available Exams</h1>
      <p className="exams-subtitle">Choose an exam and start your assessment.</p>

      <div className="exams-topbar">
        <input
          type="text"
          placeholder="Search exams..."
          className="exam-search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading exams...</p>
      ) : (
        <div className="exams-grid">
          {filtered.length === 0 ? (
            <p className="no-exams">No exams found.</p>
          ) : (
            filtered.map((exam) => (
              <div className="exam-card" key={exam.id}>
                <div>
                  <FaBook className="exam-icon" />

                <h3 className="exam-title">{exam.title}</h3>

                <div className="exam-info">
                  <span><FaClock /> {exam.duration || "60"} mins</span>
                  <span><FaQuestionCircle /> {exam.number_of_questions || "20"} Qs</span>
                  <span><FaStar /> {exam.difficulty || "Medium"}</span>
                </div>
                </div>
          

                <button className="exam-btn" onClick={()=>navigate(`/exams/${exam.id}`)}>Start Exam</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Exams;
