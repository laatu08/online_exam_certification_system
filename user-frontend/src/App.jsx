import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Exams from './pages/Exams/Exams';
import TakeExam from './pages/TakeExam/TakeExam';
import Certificates from './pages/Certificates/Certificates';
import Login from './pages/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Register from './pages/Register/Register';
import Footer from './pages/Footer'

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
    <Navbar></Navbar>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register></Register>}></Route>
      <Route path="/exams" element={<PrivateRoute><Exams /></PrivateRoute>} />
      <Route path="/exams/:examId" element={<PrivateRoute><TakeExam /></PrivateRoute>} />
      <Route path="/certificates" element={<PrivateRoute><Certificates /></PrivateRoute>} />
    </Routes>
    <Footer></Footer>
    </>
  );
}

export default App;
