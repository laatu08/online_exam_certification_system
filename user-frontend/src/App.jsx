import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Exams from './pages/Exams/Exams';
import TakeExam from './pages/TakeExam/TakeExam';
import Certificates from './pages/Certificates/Certificates';
import Login from './pages/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Register from './pages/Register/Register';
import Footer from './pages/Footer';
import Profile from './pages/Profile/Profile';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') 
    ? children 
    : <Navigate to="/login" />;
}

function App() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("token");

  const hideNavbarRoutes = ["/login", "/register"];

  const shouldShowNavbar = isAuthenticated && !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/exams" element={<PrivateRoute><Exams /></PrivateRoute>} />
        <Route path="/exams/:examId" element={<PrivateRoute><TakeExam /></PrivateRoute>} />
        <Route path="/certificates" element={<PrivateRoute><Certificates /></PrivateRoute>} />
        <Route path='/me' element={<PrivateRoute><Profile></Profile></PrivateRoute>} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
