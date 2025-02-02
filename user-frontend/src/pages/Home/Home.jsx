import {Link} from 'react-router-dom'
import React from 'react'
import './Home.css'

function PrivateRoute({ children }) {
    return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}
  
const Home = () => {
  return (
    <div className='home-container'>
      <h1>Welcome to the Online Exam System</h1>
      <p>Select an option below:</p>
      <nav className='home-nav'>
        <Link to='/exams' className='home-link'>Take an exam</Link>
        <Link to='/certificates' className='home-link'>View Certificates</Link>
      </nav>
    </div>
  )
}

export default Home
