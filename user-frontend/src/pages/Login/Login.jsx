import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Store token in local storage
      localStorage.setItem('token', response.data.token);
      
      // Redirect to exams page after login
      navigate('/exams');

    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className='login-container'>
      <h2>Login</h2>
      {error && <p className='error-message' style={{ color: 'red' }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className='login-input' />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className='login-input' />
      <button onClick={handleLogin} className='login-button'>Login</button>
      <p>Don't have an account? <a href="/register" className='register-link'>Register</a></p>
    </div>
  );
}

export default Login;
