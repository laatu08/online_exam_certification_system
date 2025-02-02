import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        localStorage.setItem('adminToken', response.data.token);
        navigate('/dashboard');
        location.reload()
      } catch (err) {
        setError('Invalid credentials. Please try again.');
      }
    };
  
    return (
      <div className='login-container'>
        <h2>Admin Login</h2>
        <div className="login-form">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
}

export default Login
