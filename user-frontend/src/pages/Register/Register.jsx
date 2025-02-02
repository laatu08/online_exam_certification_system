import React from 'react'
import { useState } from 'react';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import './Register.css'

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [role,setRole] = useState('');
    const navigate = useNavigate();
  
    const handleRegister = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
        // localStorage.setItem('userToken', response.data.token);
        navigate('/login');
      } catch (err) {
        setError('Registration failed. Please try again.');
      }
    };
  
    return (
      <div className='register-container'>
        <h2>User Register</h2>
        {error && <p className='error-message' style={{ color: 'red' }}>{error}</p>}
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    );
}

export default Register
