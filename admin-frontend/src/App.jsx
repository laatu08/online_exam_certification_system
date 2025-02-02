import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import ManageExams from './pages/ManageExams/ManageExams';
import ManageQuestions from './pages/ManageQuestions/ManageQuestions';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Navbar from './pages/Navbar/Navbar';
import Footer from './pages/Footer';

function PrivateRoute({ children }) {
  return localStorage.getItem('adminToken') ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/exams" element={<PrivateRoute><ManageExams /></PrivateRoute>} />
        <Route path="/exams/:id/questions" element={<PrivateRoute><ManageQuestions /></PrivateRoute>} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;
