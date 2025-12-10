import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <h2 className="nav-logo">ExamEase</h2>
      </div>

      {token && (
        <div className="nav-right">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/exams" className="nav-item">Exams</Link>
          <Link to="/certificates" className="nav-item">Certificates</Link>
          <Link to="/me" className="nav-item">Profile</Link>


          <button className="nav-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
