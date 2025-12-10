import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role:'student' });
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="subtitle">Join the exam platform</p>

        {error && <p className="error-message">{error}</p>}

        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="register-input"
        />

        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />

        {/* <input 
          type="text" 
          placeholder="Role (e.g., student, admin)"
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          className="register-input"
        /> */}

        <button onClick={handleRegister} className="register-button">Register</button>

        <p className="login-text">
          Already have an account? <a href="/login" className="login-link">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
